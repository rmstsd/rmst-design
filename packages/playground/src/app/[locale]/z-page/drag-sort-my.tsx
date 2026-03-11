import { cn } from '@/utils/cn'
import { configure } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { PointerEvent, useCallback, useRef, useState } from 'react'
import { startDrag } from 'rmst-design'
import { initialItems } from './claude-sort'

configure({ enforceActions: 'never' })

interface Item {
  id: string
  text: string
  height?: number
}

export const DragSortMy = observer(() => {
  console.log('render')

  const state = useLocalObservable(() => {
    return {
      items: initialItems,
      activeIndex: null,
      overIndex: null,

      translateY: []
    }
  })

  const domsMapRef = useRef<Map<string, DOMRect>>(new Map())

  const handlePointerDown = (downEvt: PointerEvent, id: string, index: number) => {
    state.activeIndex = index

    const rects = Array.from(domsMapRef.current).map(([id, rect], index) => {
      return { id, rect }
    })

    startDrag(downEvt, {
      onDragMove: moveEvent => {
        // closestCenter
        const overIndex = rects.reduce(
          (closest, item, i) => {
            const center = item.rect.top + item.rect.height / 2
            const distance = Math.abs(moveEvent.clientY - center)
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

        translateY[activeIndex] = moveEvent.clientY - downEvt.clientY
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
      state.activeIndex = null
      state.overIndex = null
      state.translateY = []
    }
  }

  return (
    <div className="px-4 space-y-2 border">
      {state.items.map((item, index) => {
        const isActive = state.activeIndex === index

        const style: React.CSSProperties = {
          transition: isActive ? 'none' : 'transform 0.3s',
          transform: `translateY(${state.translateY[index] ?? 0}px)`
        }

        return (
          <div
            key={item.id}
            ref={el => {
              if (el) {
                const ty = new DOMMatrix(getComputedStyle(el).transform).f
                console.log(ty)
                const rect = el.getBoundingClientRect().toJSON()
                rect.top -= ty
                rect.bottom -= ty
                domsMapRef.current.set(item.id, rect)
              }
            }}
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
  )
})
