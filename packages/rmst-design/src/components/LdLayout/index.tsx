import './style.less'
import { config, getComponentByName, IConfig } from './config'
import { Item } from './Item'
import { useEffect, useState } from 'react'

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

    const dragData = getComponentByName(comName)
    let dropData = getComponentByName(comName)

    const onPointerMove = (evt: PointerEvent) => {
      isDragging = true
      const target = evt.target as HTMLElement
      dropTarget = target.closest(`[${nodeAttrName}]`)

      // 查找 相对 nodeItem 的位置 上下左右中
      const dropTarget2 = target.closest(`.node-item`)

      if (dropTarget2) {
        state.dropTarget = dropTarget2
        const { clientX, clientY } = evt

        const rect = dropTarget2.getBoundingClientRect()

        if (
          clientX > rect.left + rect.width / 3 &&
          clientX < rect.left + (rect.width * 2) / 3 &&
          clientY > rect.top + rect.height / 3 &&
          clientY < rect.top + (rect.height * 2) / 3
        ) {
          console.log('center')

          state.dropRect = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          }
        } else if (clientX > rect.left && clientX < rect.left + rect.width / 3) {
          console.log('left')

          state.dropRect = {
            left: rect.left,
            top: rect.top,
            width: rect.width / 3,
            height: rect.height
          }
        } else if (clientX > rect.left + (rect.width / 3) * 2 && clientX < rect.right) {
          console.log('right')

          state.dropRect = {
            left: rect.left + (rect.width / 3) * 2,
            top: rect.top,
            width: rect.width / 3,
            height: rect.height
          }
        } else if (clientY > rect.top && clientY < rect.top + rect.height / 3) {
          console.log('top')

          state.dropRect = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height / 3
          }
        } else if (clientY > rect.top + (rect.height / 3) * 2 && clientY < rect.bottom) {
          console.log('bottom')

          state.dropRect = {
            left: rect.left,
            top: rect.top + (rect.height / 3) * 2,
            width: rect.width,
            height: rect.height / 3
          }
        }

        setState({ ...state })
      }

      return

      if (dropTarget) {
        let comName = dropTarget.getAttribute(nodeAttrName)
        dropData = getComponentByName(comName)

        state.dropTarget = dropTarget

        const mx = evt.clientX
        const my = evt.clientY

        let pos: 'left' | 'right'

        const dropRect = dropTarget.getBoundingClientRect()
        const centerX = dropRect.left + dropRect.width / 2
        if (dropRect.left < mx && mx < dropRect.left + dropRect.width) {
          if (mx < centerX) {
            pos = 'left'
            state.dropRect = {
              left: dropRect.left - 2,
              top: dropRect.top,
              width: 2,
              height: dropRect.height
            }
          } else {
            if (centerX < mx) {
              pos = 'right'
              state.dropRect = {
                left: dropRect.right + 2,
                top: dropRect.top,
                width: 2,
                height: dropRect.height
              }
            }
          }
        }

        setState({ ...state })
      }
    }

    const onPointerUp = (evt: PointerEvent) => {
      requestAnimationFrame(() => {
        isDragging = false
      })

      console.log(dragData, dropData)

      state.dragTarget = null
      state.dropTarget = null
      state.dropRect = { left: 0, top: 0, width: 0, height: 0 }
      setState({ ...state })

      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  return (
    <div className="rt-ld-layout" onPointerDown={onPointerDown}>
      <Item config={config} />

      {state.dropTarget && <div className="ghost" style={{ ...state.dropRect }}></div>}
    </div>
  )
}
