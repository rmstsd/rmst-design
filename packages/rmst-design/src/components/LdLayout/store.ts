import { configure, makeAutoObservable, toJS } from 'mobx'
import { findParentNode, IComponent, IConfig } from './config'
import { config } from './constant'

import { fixConfig, genId, getComponentById, getComponentByName, removeItem } from './config'
import { calcDistancePointToEdge, isNearAfter, isPointInRect } from './util'
import { isBrowser } from '../_util/is'

configure({ enforceActions: 'never' })

const tabItem = 'data-component-id'

let isDragging = false

if (isBrowser) {
  document.addEventListener(
    'click',
    evt => {
      if (isDragging) {
        evt.stopPropagation()
      }
    },
    { capture: true }
  )
}
class LdStore {
  constructor() {
    makeAutoObservable(this)
  }

  pageConfig: IConfig = JSON.parse(JSON.stringify(config))

  dragTarget: IComponent
  dragCoord = { x: 0, y: 0 }

  dropTarget: Element
  dropRect = { left: 0, top: 0, width: 0, height: 0 }

  dragData: IComponent
  dropData: IComponent

  dropType: 'tab-header' | 'node-item'
  dropPos: 'left' | 'right' | 'center' | 'top' | 'bottom'

  removeItem(item) {
    removeItem(item, this.pageConfig)
  }

  findParent(item): IConfig {
    return findParentNode(item, this.pageConfig)
  }

  handleHeaderDrop() {
    const { dragData, dropData, dropPos } = this
    if (dragData.config === dropData.config) {
      return
    }

    this.removeItem(dragData.config)

    const index = dropData.parent.children.indexOf(dropData.config)
    console.log(index)

    if (index === -1) {
      console.error('index is -1')
      return
    }
    dropData.parent.children.splice(dropPos === 'left' ? index : index + 1, 0, dragData.config)

    // fix 移除空的 tabSet
    const dragTabSet = dragData.parent
    const tabSetParent = findParentNode(dragTabSet, this.pageConfig)

    if (dragTabSet.children.length === 0) {
      this.removeItem(dragTabSet)
    }

    fixConfig(this.pageConfig)

    console.log(toJS(this.pageConfig))
  }

  handleTabSetDrop() {
    const { dragData, dropData, dropPos } = this
    if (!dragData || !dropData) {
      return
    }

    const idx = dragData.parent.children.indexOf(dragData.config)
    if (idx === -1) {
      console.error('idx is -1')
      return
    }
    dragData.parent.children.splice(idx, 1)

    switch (dropPos) {
      case 'center': {
        dropData.config.children.push(dragData.config)
        break
      }
      case 'top':
      case 'bottom': {
        const outer: IConfig = {
          id: genId(),
          type: 'column',
          children:
            dropPos === 'top'
              ? [{ type: 'tabset', id: genId(), children: [dragData.config] }, dropData.config]
              : [
                  dropData.config,
                  {
                    type: 'tabset',
                    id: genId(),
                    children: [dragData.config]
                  }
                ]
        }

        if (dropData.parent.type === 'column') {
          const index = dropData.parent.children.indexOf(dropData.config)
          dropData.parent.children.splice(dropPos === 'top' ? index : index + 1, 0, {
            type: 'tabset',
            id: genId(),
            children: [dragData.config]
          })
        } else {
          const index = removeItem(dropData.config, dropData.parent)
          dropData.parent.children.splice(index, 0, outer)
        }

        break
      }

      case 'left':
      case 'right': {
        const index = dropData.parent.children.indexOf(dropData.config)
        const outer: IConfig = {
          type: 'tabset',
          id: genId(),
          children: [dragData.config]
        }

        dropData.parent.children.splice(dropPos === 'left' ? index : index + 1, 0, outer)

        break
      }

      default: {
        console.error('未匹配', dropPos)
        break
      }
    }
  }

  onPointerDown = (evt: React.PointerEvent) => {
    evt.preventDefault()
    isDragging = false

    const target = evt.target as HTMLElement
    const dragTarget = target.closest(`[${tabItem}]`)
    if (!dragTarget) {
      return
    }

    const comName = dragTarget.getAttribute(tabItem)
    const dragData = getComponentByName(comName, this.pageConfig)
    this.dragTarget = dragData
    this.dragData = dragData

    const onPointerMove = (evt: PointerEvent) => {
      isDragging = true
      const { clientX, clientY } = evt
      const point = { x: clientX, y: clientY }
      this.dragCoord = { x: clientX, y: clientY }

      const target = evt.target as HTMLElement
      this.dropTarget = target.closest(`[${tabItem}]`)

      const tabHeader = target.closest(`.tab-header`)
      const dropTarget2 = target.closest(`.tabset`) // 查找 相对 tabset 的位置 上下左右中

      if (tabHeader) {
        const tabs = Array.from(tabHeader.querySelectorAll(`[${tabItem}]`))

        this.dropType = 'tab-header'

        let closestNode = null
        let minDistance = 100000

        for (const item of tabs) {
          const rect = item.getBoundingClientRect()

          if (isPointInRect(point, rect)) {
            closestNode = item
            break
          }

          const distance = calcDistancePointToEdge(point, rect)
          if (distance < minDistance) {
            minDistance = distance
            closestNode = item
          }
        }

        this.dropTarget = closestNode
        const rect = closestNode.getBoundingClientRect()
        const isAfter = isNearAfter(point, rect)

        this.dropData = getComponentByName(closestNode.getAttribute(tabItem), this.pageConfig)

        const dropRect = rect
        if (isAfter) {
          this.dropPos = 'right'
          this.dropRect = { left: dropRect.right + 2, top: dropRect.top, width: 4, height: dropRect.height }
        } else {
          this.dropPos = 'left'
          this.dropRect = { left: dropRect.left - 2, top: dropRect.top, width: 4, height: dropRect.height }
        }
      } else {
        if (dropTarget2) {
          this.dropTarget = dropTarget2
          this.dropType = 'node-item'

          this.dropData = getComponentById(dropTarget2.getAttribute('data-id'), this.pageConfig)

          const { clientX, clientY } = evt

          const rect = dropTarget2.getBoundingClientRect()

          if (
            clientX > rect.left + rect.width / 3 &&
            clientX < rect.left + (rect.width * 2) / 3 &&
            clientY > rect.top + rect.height / 3 &&
            clientY < rect.top + (rect.height * 2) / 3
          ) {
            this.dropPos = 'center'

            this.dropRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
          } else if (clientX > rect.left && clientX < rect.left + rect.width / 3) {
            this.dropPos = 'left'

            this.dropRect = { left: rect.left, top: rect.top, width: rect.width / 3, height: rect.height }
          } else if (clientX > rect.left + (rect.width / 3) * 2 && clientX < rect.right) {
            this.dropPos = 'right'

            this.dropRect = {
              left: rect.left + (rect.width / 3) * 2,
              top: rect.top,
              width: rect.width / 3,
              height: rect.height
            }
          } else if (clientY > rect.top && clientY < rect.top + rect.height / 3) {
            this.dropPos = 'top'

            this.dropRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height / 3 }
          } else if (clientY > rect.top + (rect.height / 3) * 2 && clientY < rect.bottom) {
            this.dropPos = 'bottom'

            this.dropRect = {
              left: rect.left,
              top: rect.top + (rect.height / 3) * 2,
              width: rect.width,
              height: rect.height / 3
            }
          }
        }
      }
    }

    const onPointerUp = (evt: PointerEvent) => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)

      requestAnimationFrame(() => {
        isDragging = false
      })

      if (this.dropType === 'tab-header') {
        this.handleHeaderDrop()
      } else if (this.dropType === 'node-item') {
        // this.handleTabsetDrop()
      }

      this.dragTarget = null
      this.dropTarget = null
      this.dropRect = { left: 0, top: 0, width: 0, height: 0 }

      this.dragData = null
      this.dropData = null
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  deleteTab(childConfig: IConfig, index: number, parent: IConfig) {
    this.removeItem(childConfig)
    if (parent.children.length === 0) {
      this.removeItem(parent)
    }

    console.log(toJS(this.pageConfig))
  }
}

const ldStore = new LdStore()

export default ldStore
