import { isClient } from './is'

interface DragEndData {
  isCanceled: boolean
  upEvt: PointerEvent
}
interface DragOptions {
  onDragStart?: (downEvt: React.PointerEvent | PointerEvent) => void
  onDragMove?: (moveEvt: PointerEvent) => void
  onDragEnd?: ({ isCanceled, upEvt }: DragEndData) => void

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
  let isMoved = false

  document.addEventListener(
    'pointermove',
    moveEvt => {
      const dis = Math.hypot(moveEvt.clientX - downEvt.clientX, moveEvt.clientY - downEvt.clientY)

      if (!isMoved) {
        if (dis < 10) {
          return
        }

        disableClick = true
        clearWebSelection()
        target.setPointerCapture(downEvt.pointerId)

        onDragStart?.(downEvt)
        isMoved = true
      }

      onDragMove?.(moveEvt)
    },
    { signal: abCt.signal }
  )

  let _isCanceled = false
  const cancel = (dee: DragEndData, isPointerEvent: boolean) => {
    if (isPointerEvent) {
      setTimeout(() => {
        disableClick = false
      })
    }

    if (_isCanceled) {
      return
    }
    _isCanceled = true

    abCt.abort()

    if (isMoved) {
      onDragEnd?.(dee)
    } else {
      onPointerUp?.(dee?.upEvt)
    }
  }

  document.addEventListener('pointerup', evt => cancel({ isCanceled: false, upEvt: evt }, true), { signal: abCt.signal })
  document.addEventListener('pointercancel', evt => cancel({ isCanceled: true, upEvt: evt }, true), { signal: abCt.signal })
  document.addEventListener(
    'keydown',
    evt => {
      if (evt.key === 'Escape') {
        cancel({ isCanceled: true, upEvt: null }, false)
      }
    },
    { signal: abCt.signal }
  )
}

export function clearWebSelection() {
  const sel = window.getSelection()
  if (sel.rangeCount > 0) sel.removeAllRanges()
}
