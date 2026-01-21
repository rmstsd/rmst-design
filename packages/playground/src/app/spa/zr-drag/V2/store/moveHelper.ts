import { makeAutoObservable } from 'mobx'
import { createNode, getOriDataById, NodeItem } from '../../shared/oriData'
import { contains, findNode, findParentNode } from '../../shared/utils'
import {
  allowAppend,
  allowDrag,
  calcDistancePointToEdge,
  ClosestPosition,
  getNodeRectById,
  IPoint,
  isNearAfter,
  isPointInRect,
  isRootNode
} from '../v2_utils'

export const Indicator_Height = 2
export const Item_Gap = 10
export const Indicator_BgColor = 'rgb(24, 144, 255)'
export const Indicator_Inner_BgColor = 'rgba(24, 144, 255, 0.6)'

export const DataSourceAttrName = 'data-source-id'
export const DataNodeAttrName = 'data-node-id'

type DraggedSourceType = 'node' | 'source'

class MoveHelper {
  constructor() {
    makeAutoObservable(this)

    this.init()
  }

  rootNode: NodeItem | null = null

  point = { x: 0, y: 0 }
  isDragging = false
  draggedNode: NodeItem | null = null
  draggedSourceType: DraggedSourceType | null = null
  closestNode: NodeItem | null = null
  closestPosition: ClosestPosition
  indicatorStyle: React.CSSProperties = { left: 0, top: 0, width: 0, height: Indicator_Height }

  private init() {
    let pointerDownEvent: PointerEvent

    const onPointerMove = (evt: PointerEvent) => {
      if (this.draggedNode) {
        if (!this.isDragging) {
          if (Math.hypot(evt.clientX - pointerDownEvent.clientX, evt.clientY - pointerDownEvent.clientY) < 5) {
            return
          }

          this.isDragging = true
          this.dragStart(pointerDownEvent)
        }

        this.dragMove(evt)
      }
    }

    const onPointerUp = (evt: PointerEvent) => {
      if (this.draggedNode && this.isDragging) {
        this.isDragging = false
        this.dragStop(evt)
      }

      if (!this.isDragging) {
        this.clear()
      }

      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }

    const onPointerDown = (evt: PointerEvent) => {
      const target = evt.target as HTMLElement
      if (target.closest(`[data-no-drag]`)) {
        return
      }

      pointerDownEvent = evt

      this.setDraggedNodeNode(target)

      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    }

    document.addEventListener('pointerdown', onPointerDown)
  }

  setDraggedNodeNode = (target: HTMLElement) => {
    const sourceElement = target.closest(`[${DataSourceAttrName}]`)
    const nodeElement = target.closest(`[${DataNodeAttrName}]`)

    if (sourceElement) {
      const sourceId = sourceElement.getAttribute(DataSourceAttrName)
      this.draggedNode = createNode(getOriDataById(sourceId))
      this.draggedSourceType = 'source'
    } else if (nodeElement) {
      const node = findNode(nodeElement.getAttribute(DataNodeAttrName), this.rootNode)
      if (!allowDrag(node)) {
        return
      }

      this.draggedNode = node
      this.draggedSourceType = 'node'
    }
  }

  dragStart(evt: PointerEvent) {
    console.log('dragStart')
  }

  dragMove(evt: PointerEvent) {
    const point = { x: evt.clientX, y: evt.clientY }
    this.point = point
    const target = document.elementFromPoint(point.x, point.y)

    if (!target) {
      this.clearTouch()
      return
    }

    const touchNodeElement = target.closest(`[${DataNodeAttrName}]`)
    if (!touchNodeElement) {
      this.clearTouch()
      return
    }

    const closestNode = this.calcClosestNode(point, this.findNodeByElement(touchNodeElement))

    if (contains(this.draggedNode, closestNode)) {
      this.clearTouch()
      return
    }

    this.closestNode = closestNode
    this.closestPosition = this.calcClosestPosition(point)

    this.calcIndicatorStyle()
  }

  dragStop(evt: PointerEvent) {
    console.log('dragStop')

    if (this.closestNode && !contains(this.draggedNode, this.closestNode)) {
      if (this.draggedSourceType === 'node') {
        this.removeNode(this.draggedNode)
      }

      if (this.closestPosition === ClosestPosition.Inner) {
        this.closestNode.children.push(this.draggedNode)
      } else {
        const closestParent = findParentNode(this.closestNode.id, this.rootNode)
        const index = closestParent.children.indexOf(this.closestNode)

        if (this.closestPosition === ClosestPosition.Beforebegin) {
          closestParent.children.splice(index, 0, this.draggedNode)
        } else if (this.closestPosition === ClosestPosition.Afterend) {
          closestParent.children.splice(index + 1, 0, this.draggedNode)
        }
      }
    }

    this.clear()
  }

  calcClosestNode(point: IPoint, touchNode: NodeItem) {
    if (touchNode.expanded && touchNode.children.length > 0) {
      let closestNode: NodeItem | null = touchNode
      const touchNodeRect = getNodeRectById(touchNode.id)
      const touchDistance = calcDistancePointToEdge(point, touchNodeRect)
      let minDistance = touchDistance

      touchNode.children.forEach(child => {
        const rect = getNodeRectById(child.id)
        const distance = isPointInRect(point, rect) ? 0 : calcDistancePointToEdge(point, rect)

        if (distance < minDistance) {
          minDistance = distance
          closestNode = child
        }
      })

      return closestNode
    }

    return touchNode
  }

  calcClosestPosition(point: IPoint): ClosestPosition {
    if (isRootNode(this.closestNode)) {
      return ClosestPosition.Inner
    }

    const rect = getNodeRectById(this.closestNode.id)
    const isAfter = isNearAfter(point, rect)

    let closestPosition: ClosestPosition

    if (isPointInRect(point, rect)) {
      if (allowAppend(this.closestNode)) {
        if (this.closestNode.children.length > 0) {
          closestPosition = isAfter ? ClosestPosition.Afterend : ClosestPosition.Beforebegin
        } else {
          closestPosition = ClosestPosition.Inner
        }
      } else {
        closestPosition = isAfter ? ClosestPosition.Afterend : ClosestPosition.Beforebegin
      }
    } else {
      closestPosition = isAfter ? ClosestPosition.Afterend : ClosestPosition.Beforebegin
    }

    return closestPosition
  }

  calcIndicatorStyle() {
    const closestRect = getNodeRectById(this.closestNode.id)
    this.indicatorStyle.width = closestRect.width
    this.indicatorStyle.left = closestRect.left
    this.indicatorStyle.height = Indicator_Height
    this.indicatorStyle.backgroundColor = Indicator_BgColor

    const { closestPosition } = this
    if (closestPosition === ClosestPosition.Beforebegin) {
      this.indicatorStyle.top = closestRect.y - Indicator_Height / 2 - Item_Gap / 2
    } else if (closestPosition === ClosestPosition.Afterend) {
      this.indicatorStyle.top = closestRect.y + closestRect.height - Indicator_Height / 2 + Item_Gap / 2
    } else if (closestPosition === ClosestPosition.Inner) {
      this.indicatorStyle.top = closestRect.y
      this.indicatorStyle.height = closestRect.height
      this.indicatorStyle.backgroundColor = Indicator_Inner_BgColor
    }
  }

  findNodeByElement(element: Element) {
    const nodeId = element.getAttribute(DataNodeAttrName)
    const node = findNode(nodeId, this.rootNode)
    return node
  }

  clear() {
    this.draggedNode = null
    this.draggedSourceType = null

    this.clearTouch()
  }

  clearTouch() {
    this.closestNode = null
    this.closestPosition = null

    this.indicatorStyle.left = 0
    this.indicatorStyle.top = 0
    this.indicatorStyle.width = 0
  }

  removeNode(node: NodeItem) {
    const parentNode = findParentNode(node.id, this.rootNode)
    parentNode.children.splice(parentNode.children.indexOf(node), 1)
  }
}

export default MoveHelper
