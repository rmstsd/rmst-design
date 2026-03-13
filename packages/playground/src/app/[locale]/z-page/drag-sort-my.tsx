import { cn } from '@/utils/cn'
import { configure } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { PointerEvent, useRef } from 'react'
import { startDrag } from 'rmst-design'
import { initialItems } from './claude-sort'

configure({ enforceActions: 'never' })

export const DragSortMy = observer(() => {
  const state = useLocalObservable(() => {
    return {
      items: initialItems,
      activeIndex: null,
      overIndex: null,
      translateY: [],

      dragState: {
        down_clientY: 0,
        down_scrollTop: 0,
        move_clientY: 0
      }
    }
  })

  const domsMapRef = useRef<Map<string, DOMRect>>(new Map())

  const domRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const setDomRef = (id, el) => {
    domRefs.current.set(id, el)
  }

  const handlePointerDown = async (downEvt: PointerEvent, id: string, index: number) => {
    state.dragState.down_clientY = downEvt.clientY
    state.dragState.move_clientY = downEvt.clientY
    state.activeIndex = index

    const container = document.getElementById('rmst-container')
    const containerRect = container.getBoundingClientRect()
    state.dragState.down_scrollTop = container.scrollTop

    calcListPosition()

    autoScroll()

    startDrag(downEvt, {
      onDragMove: moveEvent => {
        let move_clientY = moveEvent.clientY
        state.dragState.move_clientY = move_clientY

        if (containerRect.top <= move_clientY && move_clientY <= containerRect.bottom) {
          speedRef.current = 0
        } else if (move_clientY < containerRect.top) {
          speedRef.current = move_clientY - containerRect.top
        } else if (containerRect.bottom < move_clientY) {
          speedRef.current = move_clientY - containerRect.bottom
        }
      },
      onDragEnd: () => {
        if (state.overIndex !== state.activeIndex) {
        }

        reset()
      },
      onPointerUp: () => {
        reset()
      }
    })

    const reset = () => {
      state.activeIndex = null
      state.overIndex = null
      state.translateY = []

      speedRef.current = 0

      cancelAnimationFrame(rafId.current)
    }
  }

  const calcListPosition = () => {
    for (const [id, el] of domRefs.current) {
      const rect = el.getBoundingClientRect().toJSON()
      domsMapRef.current.set(id, rect)
    }
  }

  const calcTranslateY = () => {
    let { down_clientY, down_scrollTop, move_clientY } = state.dragState

    const container = containerRef.current
    const dy = container.scrollTop - down_scrollTop
    move_clientY += dy

    const rects = Array.from(domsMapRef.current).map(([id, rect]) => ({ id, rect }))
    // 寻找到最近的一个元素
    const overIndex = rects.reduce(
      (closest, item, i) => {
        const center = item.rect.top + item.rect.height / 2
        const distance = Math.abs(move_clientY - center)
        return distance < closest.distance ? { index: i, distance } : closest
      },
      { index: -1, distance: Infinity }
    ).index

    state.overIndex = overIndex
    const { activeIndex } = state

    const translateY = []
    if (overIndex > activeIndex) {
      const offset = rects[activeIndex].rect.top - rects[activeIndex + 1].rect.top

      for (let i = activeIndex + 1; i <= overIndex; i++) {
        translateY[i] = offset
      }
    } else if (overIndex < activeIndex) {
      const offset = rects[activeIndex].rect.bottom - rects[activeIndex - 1].rect.bottom

      for (let i = activeIndex - 1; i >= overIndex; i--) {
        translateY[i] = offset
      }
    } else if (overIndex === activeIndex) {
    }

    translateY[activeIndex] = move_clientY - down_clientY
    state.translateY = [...translateY]
  }

  let speedRef = useRef(0)
  const rafId = useRef<number>(0)

  function autoScroll() {
    if (speedRef.current !== 0) {
      const rmstContainer = document.querySelector('#rmst-container')
      rmstContainer.scrollBy(0, speedRef.current)
    }

    calcTranslateY()

    rafId.current = requestAnimationFrame(autoScroll)
  }

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="rmstsd-dsm-c relative mt-10">
      <div id="rmst-container" ref={containerRef} className="px-4 space-y-2 overflow-auto" style={{ height: 600 }}>
        {state.items.map((item, index) => {
          const isActive = state.activeIndex === index

          const style: React.CSSProperties = {
            transition: isActive ? 'none' : 'transform 0.3s',
            transform: `translateY(${state.translateY[index] ?? 0}px)`
          }

          return (
            <div
              key={item.id}
              ref={el => setDomRef(item.id, el)}
              style={style}
              onPointerDown={evt => handlePointerDown(evt, item.id, index)}
              className={cn(
                'rounded-xl bg-slate-500 px-4 py-3 text-sm shadow-sm text-white select-none',
                isActive ? 'ring-sky-500 shadow-lg bg-slate-800 relative z-10' : ''
              )}
            >
              <div className="mt-2">{item.id}</div>
              <div className="mt-2">{item.text}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

// 不能在 onDragMove 中调用 reCalc, 因为 transform 和 动画的存在 会导致 getBoundingClientRect 不准确
