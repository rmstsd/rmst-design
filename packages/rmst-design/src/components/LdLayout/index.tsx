import './style.less'
import { fixConfig, genId, getComponentById, getComponentByName, IConfig, removeItem } from './config'
import { Item } from './Item'
import { useEffect, useState } from 'react'
import { calcDistancePointToEdge, isNearAfter, isPointInRect } from './util'
import { config } from './constant'

const nodeAttrName = 'data-component-id'

let isDragging = false

document.addEventListener(
  'click',
  evt => {
    if (isDragging) {
      evt.stopPropagation()
    }
  },
  { capture: true }
)

export function LdLayout() {
  const [pageConfig, setPageConfig] = useState(config)

  const [state, setState] = useState({
    dragTarget: null,
    dropTarget: null,
    dropRect: { left: 0, top: 0, width: 0, height: 0 }
  })

  const onPointerDown = (evt: React.PointerEvent) => {
    evt.preventDefault()

    isDragging = false

    const target = evt.target as HTMLElement
    const dragTarget = target.closest(`[${nodeAttrName}]`)
    if (!dragTarget) {
      return
    }

    let dropTarget: HTMLElement | null = null

    const comName = dragTarget.getAttribute(nodeAttrName)

    const dragData = getComponentByName(comName, pageConfig)
    let dropData = getComponentByName(comName, pageConfig)

    let dropType: 'tab-header' | 'node-item'
    let dropPos: 'left' | 'right' | 'center' | 'top' | 'bottom'

    const onPointerMove = (evt: PointerEvent) => {
      const { clientX, clientY } = evt
      const point = { x: clientX, y: clientY }

      isDragging = true
      const target = evt.target as HTMLElement
      dropTarget = target.closest(`[${nodeAttrName}]`)

      const tabHeader = target.closest(`.tab-header`)
      if (tabHeader) {
        const tabs = Array.from(tabHeader.querySelectorAll(`[${nodeAttrName}]`))

        dropType = 'tab-header'

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

        state.dropTarget = closestNode
        const rect = closestNode.getBoundingClientRect()
        const isAfter = isNearAfter(point, rect)

        dropData = getComponentByName(closestNode.getAttribute(nodeAttrName), pageConfig)

        const dropRect = rect
        if (isAfter) {
          dropPos = 'right'
          state.dropRect = { left: dropRect.right + 2, top: dropRect.top, width: 4, height: dropRect.height }
        } else {
          dropPos = 'left'
          state.dropRect = { left: dropRect.left - 2, top: dropRect.top, width: 4, height: dropRect.height }
        }

        setState({ ...state })
        console.log(closestNode.getAttribute(nodeAttrName), isAfter)
      } else {
        // 查找 相对 nodeItem 的位置 上下左右中
        const dropTarget2 = target.closest(`.tabset`)

        if (dropTarget2) {
          state.dropTarget = dropTarget2
          dropType = 'node-item'

          dropData = getComponentById(dropTarget2.getAttribute('data-id'), pageConfig)

          const { clientX, clientY } = evt

          const rect = dropTarget2.getBoundingClientRect()

          if (
            clientX > rect.left + rect.width / 3 &&
            clientX < rect.left + (rect.width * 2) / 3 &&
            clientY > rect.top + rect.height / 3 &&
            clientY < rect.top + (rect.height * 2) / 3
          ) {
            console.log('center')
            dropPos = 'center'

            state.dropRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
          } else if (clientX > rect.left && clientX < rect.left + rect.width / 3) {
            console.log('left')
            dropPos = 'left'

            state.dropRect = { left: rect.left, top: rect.top, width: rect.width / 3, height: rect.height }
          } else if (clientX > rect.left + (rect.width / 3) * 2 && clientX < rect.right) {
            console.log('right')

            dropPos = 'right'

            state.dropRect = {
              left: rect.left + (rect.width / 3) * 2,
              top: rect.top,
              width: rect.width / 3,
              height: rect.height
            }
          } else if (clientY > rect.top && clientY < rect.top + rect.height / 3) {
            console.log('top')
            dropPos = 'top'

            state.dropRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height / 3 }
          } else if (clientY > rect.top + (rect.height / 3) * 2 && clientY < rect.bottom) {
            console.log('bottom')
            dropPos = 'bottom'

            state.dropRect = {
              left: rect.left,
              top: rect.top + (rect.height / 3) * 2,
              width: rect.width,
              height: rect.height / 3
            }
          }

          setState({ ...state })
        }
      }
    }

    const onPointerUp = (evt: PointerEvent) => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)

      requestAnimationFrame(() => {
        isDragging = false
      })

      state.dragTarget = null
      state.dropTarget = null
      state.dropRect = { left: 0, top: 0, width: 0, height: 0 }
      setState({ ...state })

      console.log('-- drop')
      console.log(dragData, dropData)

      console.log(dropType, dropPos)

      if (dropType === 'tab-header') {
        if (dragData.config === dropData.config) {
          return
        }

        const idx = dragData.parent.children.indexOf(dragData.config)
        if (idx === -1) {
          console.error('idx is -1')
          return
        }
        dragData.parent.children.splice(idx, 1)

        const index = dropData.parent.children.indexOf(dropData.config)
        if (index === -1) {
          console.error('index is -1')
          return
        }

        switch (dropPos) {
          case 'left': {
            dropData.parent.children.splice(index, 0, dragData.config)
            break
          }
          case 'right': {
            dropData.parent.children.splice(index + 1, 0, dragData.config)
            break
          }

          default: {
            console.error('未匹配', dropPos)
            break
          }
        }

        setPageConfig({ ...pageConfig })
      } else if (dropType === 'node-item') {
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
              type: 'row',
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

            const index = removeItem(dropData.config, dropData.parent)
            dropData.parent.children.splice(index, 0, outer)

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

      fixConfig(pageConfig)
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  console.log('render', pageConfig)

  return (
    <div className="rt-ld-layout" onPointerDown={onPointerDown}>
      <Item config={pageConfig} />

      {state.dropTarget && <div className="ghost" style={{ ...state.dropRect }}></div>}
    </div>
  )
}
