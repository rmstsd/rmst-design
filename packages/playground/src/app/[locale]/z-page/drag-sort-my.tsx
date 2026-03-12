import { cn } from '@/utils/cn'
import { configure } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { PointerEvent, useCallback, useRef, useState } from 'react'
import { startDrag } from 'rmst-design'
import { initialItems } from './claude-sort'
import { isNotNil } from 'es-toolkit'

configure({ enforceActions: 'never' })

interface Item {
  id: string
  text: string
  height?: number
}

export const DragSortMy = observer(() => {
  const state = useLocalObservable(() => {
    return {
      items: initialItems,
      activeIndex: null,
      overIndex: null,

      translateY: [],

      dragPos: { x: 0, y: 0 }
    }
  })

  const domsMapRef = useRef<Map<string, DOMRect>>(new Map())

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRafRef = useRef<number>(null)

  const startAutoScroll = (mouseY: number) => {
    cancelAnimationFrame(scrollRafRef.current)

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const Threshold = 40
    const Max_Speed = 10

    let speed = 0
    if (mouseY < rect.top + Threshold) {
      speed = -Max_Speed * (1 - (mouseY - rect.top) / Threshold)
    } else if (mouseY > rect.bottom - Threshold) {
      speed = Max_Speed * (1 - (rect.bottom - mouseY) / Threshold)
    }

    speed = Math.max(-Max_Speed, Math.min(Max_Speed, speed))

    if (speed === 0) return

    const step = () => {
      container.scrollTop += speed
      scrollRafRef.current = requestAnimationFrame(step)
    }
    step()
    scrollRafRef.current = requestAnimationFrame(step)
  }

  const stopAutoScroll = () => {
    cancelAnimationFrame(scrollRafRef.current)
  }

  const handlePointerDown = async (downEvt: PointerEvent, id: string, index: number) => {
    // await nextFrame()

    reCalc()

    const down_scrollTop = containerRef.current.scrollTop

    state.activeIndex = index

    state.dragPos.x = downEvt.clientX
    state.dragPos.y = downEvt.clientY

    const rects = Array.from(domsMapRef.current).map(([id, rect], index) => {
      return { id, rect }
    })

    startDrag(downEvt, {
      onDragMove: moveEvent => {
        startAutoScroll(moveEvent.clientY)

        reCalc()

        state.dragPos.x = moveEvent.clientX
        state.dragPos.y = moveEvent.clientY

        const containerRect = containerRef.current?.getBoundingClientRect()

        const down_scene_y = downEvt.clientY - containerRect.top

        let move_scene_y = moveEvent.clientY - containerRect.top

        const d_scrollTop = containerRef.current.scrollTop - down_scrollTop
        console.log(d_scrollTop)

        // closestCenter
        const overIndex = rects.reduce(
          (closest, item, i) => {
            const center = item.rect.top + item.rect.height / 2
            const distance = Math.abs(move_scene_y - center)
            return distance < closest.distance ? { index: i, distance } : closest
          },
          { index: -1, distance: Infinity }
        ).index

        state.overIndex = overIndex
        const { activeIndex } = state

        const translateY = []

        if (overIndex > activeIndex) {
          let offset = null
          for (let i = activeIndex + 1; i <= overIndex; i++) {
            const prevRect = rects[i - 1].rect
            const rect = rects[i].rect

            if (!offset) {
              offset = prevRect.top - rect.top
            }

            translateY[i] = offset
          }
        } else if (overIndex < activeIndex) {
          let offset = null
          for (let i = activeIndex - 1; i >= overIndex; i--) {
            const nextRect = rects[i + 1].rect
            const rect = rects[i].rect
            if (!offset) {
              offset = nextRect.bottom - rect.bottom
            }
            translateY[i] = offset
          }
        } else if (overIndex === activeIndex) {
        }

        translateY[activeIndex] = move_scene_y - down_scene_y
        state.translateY = [...translateY]
      },
      onDragEnd: () => {
        if (state.overIndex !== state.activeIndex) {
          // state.items = arrayMove(state.items, state.activeIndex, state.overIndex)

          function arrayMove(array: Item[], from: number, to: number) {
            const result = array.slice()
            const [moved] = result.splice(from, 1)
            result.splice(to, 0, moved)
            return result
          }
        }

        reset()
      },
      onPointerUp: () => {
        reset()
      }
    })

    const reset = () => {
      stopAutoScroll()
      state.activeIndex = null
      state.overIndex = null
      state.translateY = []
    }
  }

  const renderActive = () => {
    if (isNotNil(state.activeIndex) && state.activeIndex > -1) {
      const item = state.items[state.activeIndex]

      return (
        <div
          className="bg-white shadow-sm p-2 fixed z-20 pointer-events-none"
          style={{ left: state.dragPos.x, top: state.dragPos.y, maxWidth: 300 }}
        >
          {item.text}
        </div>
      )
    }

    return null
  }

  const setContainerRef = (el: HTMLDivElement) => {
    containerRef.current = el

    // reCalc()
  }

  const domRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const setDomRef = (id, el) => {
    domRefs.current.set(id, el)

    // reCalc()
  }

  const reCalc = () => {
    console.log('reCalc')

    const container = containerRef.current
    if (!container) {
      return
    }

    const containerRect = container.getBoundingClientRect()

    for (const [id, el] of domRefs.current) {
      if (!el) {
        continue
      }

      const ty = new DOMMatrix(getComputedStyle(el).transform).f
      const rect = el.getBoundingClientRect().toJSON()

      rect.top = rect.top - containerRect.top
      rect.bottom = rect.bottom - containerRect.bottom

      rect.top -= ty
      rect.bottom -= ty

      domsMapRef.current.set(id, rect)
    }
  }

  return (
    <div className="rmstsd-dsm-c relative">
      {renderActive()}

      <div className="px-4 space-y-2 border overflow-auto" ref={setContainerRef} style={{ height: 700 }}>
        {state.items.map((item, index) => {
          const isActive = state.activeIndex === index

          const style: React.CSSProperties = {
            transition: isActive ? 'none' : 'transform 0.3s',
            transform: `translateY(${state.translateY[index] ?? 0}px)`,
            visibility: isActive ? 'hidden' : 'visible'
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

function nextFrame() {
  return new Promise(resolve => setTimeout(resolve, 50))
}
