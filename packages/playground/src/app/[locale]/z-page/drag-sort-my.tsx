import { cn } from '@/utils/cn'
import { configure } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { PointerEvent, useRef, useState } from 'react'
import { startDrag } from 'rmst-design'

configure({ enforceActions: 'never' })

interface Item {
  id: string
  text: string
  height?: number
}

const initialItems: Item[] = [
  { id: 'a-1', text: '1 Design', height: 40 },
  { id: 'a-2', text: '2 Implement', height: 50 },
  { id: 'a-3', text: '3 Setup', height: 60 },
  { id: 'a-4', text: '4 Write API', height: 70 },
  { id: 'a-5', text: '5 Deploy to', height: 80 },
  { id: 'a-6', text: '6 Deploy to', height: 90 },
  { id: 'a-7', text: '7 Deploy to', height: 100 }
]

export const DragSortMy = observer(() => {
  const state = useLocalObservable(() => {
    return {
      items: initialItems,
      activeIndex: null,
      overIndex: null,

      translateY: []
    }
  })

  const domsRef = useRef<HTMLDivElement[]>([])

  const handlePointerDown = (downEvt: PointerEvent, id: string, index: number) => {
    state.activeIndex = index

    const rects = domsRef.current.map((item, index) => {
      const rect = item.getBoundingClientRect()
      const nextRect = domsRef.current[index + 1]?.getBoundingClientRect()

      return {
        y_start: index === 0 ? -Infinity : rect.top,
        y_end: index === domsRef.current.length - 1 ? Infinity : nextRect?.top,
        rect
      }
    })

    startDrag(downEvt, {
      onDragMove: moveEvent => {
        let overIndex = rects.findIndex(item => moveEvent.clientY > item.y_start && moveEvent.clientY < item.y_end)
        state.overIndex = overIndex
        const { activeIndex } = state

        if (overIndex === -1) {
          return
        }

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
          transform: `translateY(${state.translateY[index] ?? 0}px)`,
          height: item.height
        }

        return (
          <div
            key={item.id}
            ref={el => {
              domsRef.current[index] = el
            }}
            style={style}
            onPointerDown={evt => handlePointerDown(evt, item.id, index)}
            className={cn(
              'rounded-xl bg-slate-500 px-4 py-3 text-sm shadow-sm text-white select-none',
              isActive ? 'ring-sky-500 shadow-lg bg-slate-800 relative z-10' : ''
            )}
          >
            {item.text}
          </div>
        )
      })}
    </div>
  )
})
