import { isClient } from './is'

interface DragOptions {
  onDragStart?: (downEvt: React.PointerEvent | PointerEvent) => void
  onDragMove?: (moveEvt: PointerEvent) => void
  onDragEnd?: (upEvt: PointerEvent) => void

  onPointerUp?: (upEvt: PointerEvent) => void // 与 html 类似, 发生了 drag 后, 就不会触发 onPointerUp 事件
}

let disableClick = false
if (isClient) {
  document.addEventListener(
    'click',
    evt => {
      if (disableClick) {
        evt.stopPropagation()
      }
    },
    { capture: true }
  )
}

export const startDrag = (downEvt: React.PointerEvent | PointerEvent, options: DragOptions) => {
  const { onDragStart, onDragMove, onDragEnd, onPointerUp } = options

  const abCt = new AbortController()

  const target = downEvt.target as HTMLElement
  target.setPointerCapture(downEvt.pointerId)

  let isMoved = false

  target.addEventListener(
    'pointermove',
    moveEvt => {
      const dis = Math.hypot(moveEvt.clientX - downEvt.clientX, moveEvt.clientY - downEvt.clientY)

      if (!isMoved) {
        if (dis < 10) {
          return
        }
        disableClick = true
        clearWebSelection()

        onDragStart?.(downEvt)
        isMoved = true
      }

      onDragMove?.(moveEvt)
    },
    { signal: abCt.signal }
  )

  const cancel = (evt: PointerEvent) => {
    setTimeout(() => {
      disableClick = false
    })

    abCt.abort()

    if (isMoved) {
      onDragEnd?.(evt)
    } else {
      onPointerUp?.(evt)
    }
  }

  target.addEventListener('pointerup', cancel, { signal: abCt.signal })
  target.addEventListener('pointercancel', cancel, { signal: abCt.signal })
}

export function clearWebSelection() {
  const sel = window.getSelection()
  if (sel.rangeCount > 0) sel.removeAllRanges()
}
