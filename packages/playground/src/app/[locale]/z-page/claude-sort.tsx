import { cn } from '@/utils/cn'
import { useVirtualizer } from '@tanstack/react-virtual'
import { configure } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { PointerEvent, useRef } from 'react'
import { startDrag } from 'rmst-design'

configure({ enforceActions: 'never' })

interface Item {
  id: string
  text: string
}

const GAP = 8
const CONTAINER_HEIGHT = 400
const DEFAULT_HEIGHT = 50

const textPool = [
  'Design',
  'Implement the user authentication module with OAuth support',
  'Setup',
  'Write API endpoints for data management including pagination, filtering and sorting capabilities across all resources',
  'Deploy to production',
  'Write comprehensive test suites covering both unit and integration scenarios to ensure system reliability',
  'Review',
  'Configure the CI/CD pipeline with automated testing, staging deployments, and production release workflows for multiple environments',
  'Fix bugs',
  'Refactor the database access layer to support multiple database backends and implement connection pooling for improved performance under heavy concurrent load',
  'Update deps',
  'Design and implement the real-time notification system supporting email, SMS, and push notifications with configurable user preference management and delivery tracking',
  'Optimize queries',
  'Build the admin dashboard with role-based access control, comprehensive activity logging, user management tools, and system health monitoring capabilities for operations team'
]

export const initialItems: Item[] = Array.from({ length: 100 }, (_, i) => ({
  id: `index-${i}`,
  text: `${i + 1}. ${textPool[i % textPool.length]}`
}))

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const result = array.slice()
  const [moved] = result.splice(from, 1)
  result.splice(to, 0, moved)
  return result
}

export const ClaudeSort = observer(() => {
  const state = useLocalObservable(() => ({
    items: initialItems,
    activeIndex: null as number | null,
    overIndex: null as number | null,
    dragOffsets: [] as number[],
    isDropping: false
  }))

  const parentRef = useRef<HTMLDivElement>(null)
  const heightsRef = useRef(new Map<string, number>())

  const getItemHeight = (item: Item) => heightsRef.current.get(item.id) ?? DEFAULT_HEIGHT

  const virtualizer = useVirtualizer({
    count: state.items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: index => getItemHeight(state.items[index]),
    getItemKey: index => state.items[index].id,
    gap: GAP,
    overscan: 5
  })

  const computePositions = (items: Item[]) => {
    const positions: number[] = []
    let top = 0
    for (let i = 0; i < items.length; i++) {
      positions[i] = top
      top += getItemHeight(items[i]) + GAP
    }
    return positions
  }

  const handlePointerDown = (downEvt: PointerEvent, index: number) => {
    state.activeIndex = index

    const containerRect = parentRef.current!.getBoundingClientRect()
    const startScrollTop = parentRef.current!.scrollTop
    const activeHeight = getItemHeight(state.items[index])

    const dragCtx = {
      clientY: downEvt.clientY,
      startClientY: downEvt.clientY
    }

    const recalculate = () => {
      const positions = computePositions(state.items)
      const scrollTop = parentRef.current!.scrollTop
      const deltaScroll = scrollTop - startScrollTop
      const deltaY = dragCtx.clientY - dragCtx.startClientY + deltaScroll

      const originalTop = positions[index]
      const effectiveCenter = originalTop + deltaY + activeHeight / 2

      // 从 activeIndex 向两侧扫描，找到被拖过的最远位置
      let overIndex = index
      for (let i = index + 1; i < state.items.length; i++) {
        if (effectiveCenter >= positions[i] + getItemHeight(state.items[i]) / 2) {
          overIndex = i
        } else {
          break
        }
      }
      if (overIndex === index) {
        for (let i = index - 1; i >= 0; i--) {
          if (effectiveCenter <= positions[i] + getItemHeight(state.items[i]) / 2) {
            overIndex = i
          } else {
            break
          }
        }
      }

      state.overIndex = overIndex

      const dragOffsets: number[] = []
      const activeStep = activeHeight + GAP

      if (overIndex > index) {
        for (let i = index + 1; i <= overIndex; i++) {
          dragOffsets[i] = -activeStep
        }
      } else if (overIndex < index) {
        for (let i = index - 1; i >= overIndex; i--) {
          dragOffsets[i] = activeStep
        }
      }

      dragOffsets[index] = deltaY
      state.dragOffsets = [...dragOffsets]
    }

    // Auto-scroll
    let autoScrollRaf: number | null = null
    let scrollSpeed = 0

    const autoScrollLoop = () => {
      if (scrollSpeed !== 0) {
        parentRef.current?.scrollBy(0, scrollSpeed)
        recalculate()
      }
      autoScrollRaf = requestAnimationFrame(autoScrollLoop)
    }

    const updateAutoScroll = (clientY: number) => {
      const threshold = 50
      const maxSpeed = 15
      const topDist = clientY - containerRect.top
      const bottomDist = containerRect.bottom - clientY

      if (topDist < threshold) {
        scrollSpeed = -maxSpeed * Math.min(1, (threshold - topDist) / threshold)
      } else if (bottomDist < threshold) {
        scrollSpeed = maxSpeed * Math.min(1, (threshold - bottomDist) / threshold)
      } else {
        scrollSpeed = 0
      }
    }

    startDrag(downEvt, {
      onDragStart: () => {
        autoScrollRaf = requestAnimationFrame(autoScrollLoop)
      },
      onDragMove: moveEvt => {
        dragCtx.clientY = moveEvt.clientY
        recalculate()
        updateAutoScroll(moveEvt.clientY)
      },
      onDragEnd: () => {
        if (autoScrollRaf) cancelAnimationFrame(autoScrollRaf)

        const { activeIndex, overIndex } = state
        if (overIndex !== null && overIndex !== activeIndex) {
          const positions = computePositions(state.items)
          const newItems = arrayMove(state.items, activeIndex!, overIndex)
          const newPositions = computePositions(newItems)
          const targetOffset = newPositions[overIndex] - positions[activeIndex!]

          const finalOffsets = [...state.dragOffsets]
          finalOffsets[activeIndex!] = targetOffset
          state.dragOffsets = finalOffsets
          state.isDropping = true

          setTimeout(() => {
            state.items = arrayMove(state.items, activeIndex!, overIndex)
            reset()
          }, 300)
        } else {
          reset()
        }
      },
      onPointerUp: () => {
        if (autoScrollRaf) cancelAnimationFrame(autoScrollRaf)
        reset()
      }
    })

    const reset = () => {
      state.activeIndex = null
      state.overIndex = null
      state.dragOffsets = []
      state.isDropping = false
    }
  }

  return (
    <div ref={parentRef} className="rmst-container border m-6 overflow-auto" style={{ height: CONTAINER_HEIGHT }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
        {virtualizer.getVirtualItems().map(virtualRow => {
          const index = virtualRow.index
          const item = state.items[index]
          const isActive = state.activeIndex === index
          const dragOffset = state.dragOffsets[index] ?? 0

          return (
            <div
              key={item.id}
              data-index={virtualRow.index}
              ref={node => {
                virtualizer.measureElement(node)
                if (node) {
                  heightsRef.current.set(item.id, node.getBoundingClientRect().height)
                }
              }}
              style={{
                position: 'absolute',
                top: virtualRow.start,
                left: 0,
                width: '100%',
                transform: `translateY(${isActive ? 0 : dragOffset}px)`,
                transition: isActive && !state.isDropping ? 'none' : 'transform 0.3s',
                visibility: isActive ? 'hidden' : 'visible',
                zIndex: isActive ? 10 : undefined
              }}
              onPointerDown={evt => handlePointerDown(evt, index)}
              className={cn(
                'rounded-xl bg-slate-500 px-4 py-3 text-sm shadow-sm text-white select-none',
                isActive ? 'ring-sky-500 shadow-lg bg-slate-800' : ''
              )}
            >
              {item.text}
            </div>
          )
        })}
      </div>
    </div>
  )
})
