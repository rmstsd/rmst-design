'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Item {
  id: string
  text: string
}

const initialItems: Item[] = [
  { id: '1', text: 'Design Homepage' },
  { id: '2', text: 'Implement Authentication' },
  { id: '3', text: 'Setup Database' },
  { id: '4', text: 'Write API Documentation' },
  { id: '5', text: 'Deploy to Production' }
]

const arrayMove = <T,>(array: T[], from: number, to: number): T[] => {
  const result = array.slice()
  const [moved] = result.splice(from, 1)
  result.splice(to, 0, moved)
  return result
}

const DragSortFlip: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const startPointerYRef = useRef(0)
  const startIndexRef = useRef(0)
  const itemHeightRef = useRef(0)
  const activeElementRef = useRef<HTMLDivElement | null>(null)

  const itemsRef = useRef(items)
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const registerItem =
    (id: string, index: number) =>
    (el: HTMLDivElement | null): void => {
      itemRefs.current[id] = el
      if (index === 0 && el) {
        // 记录统一高度（含 margin gap），用于计算索引偏移
        const rect = el.getBoundingClientRect()
        itemHeightRef.current = rect.height + 12
      }
    }

  const handlePointerDown =
    (id: string, index: number) =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      const el = itemRefs.current[id]
      if (!el) return

      activeElementRef.current = el

      setActiveId(id)
      startPointerYRef.current = event.clientY
      startIndexRef.current = index
      setOverIndex(index)

      el.style.willChange = 'transform'
      el.style.transition = 'none'
      el.style.zIndex = '50'

      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // ignore
      }

      const handleMove = (e: PointerEvent) => {
        const activeEl = activeElementRef.current
        if (!activeEl) return

        const deltaY = e.clientY - startPointerYRef.current
        activeEl.style.transform = `translate3d(0, ${deltaY}px, 0)`

        const items = itemsRef.current
        if (!items.length) return

        const itemHeight = itemHeightRef.current || activeEl.getBoundingClientRect().height
        if (!itemHeight) return

        const rawIndexShift = deltaY / itemHeight
        let nextIndex = startIndexRef.current + Math.round(rawIndexShift)

        nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex))
        if (nextIndex !== overIndex) {
          setOverIndex(nextIndex)
        }
      }

      const handleUp = () => {
        const activeEl = activeElementRef.current
        const currentItems = itemsRef.current

        if (activeId != null && overIndex != null) {
          const fromIndex = currentItems.findIndex(item => item.id === activeId)
          if (fromIndex !== -1 && fromIndex !== overIndex) {
            setItems(prev => arrayMove(prev, fromIndex, overIndex))
          }
        }

        if (activeEl) {
          activeEl.style.transition =
            'transform 200ms cubic-bezier(0.2, 0.0, 0.2, 1), box-shadow 150ms ease, background-color 150ms ease, opacity 120ms ease'
          activeEl.style.transform = 'translate3d(0, 0, 0)'
          activeEl.style.zIndex = 'auto'
          activeEl.style.willChange = 'auto'
        }

        setActiveId(null)
        setOverIndex(null)
        activeElementRef.current = null

        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
        window.removeEventListener('pointercancel', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      window.addEventListener('pointercancel', handleUp)
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 p-6 shadow-xl border border-slate-800">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">拖拽排序（dnd-kit 风格动画）</h2>
        <p className="mb-4 text-sm text-slate-400">
          使用原生指针事件，实现与 dnd-kit sortable 类似的「跟随拖拽 + 其它项平滑让位」效果。
        </p>
        <div className="space-y-3">
          {items.map((item, index) => {
            const isActive = activeId === item.id
            const startIndex = startIndexRef.current
            const targetIndex = overIndex ?? startIndex

            let translateY = 0
            if (activeId != null && !isActive) {
              if (index > startIndex && index <= targetIndex) {
                translateY = -1 * (itemHeightRef.current || 0)
              } else if (index < startIndex && index >= targetIndex) {
                translateY = itemHeightRef.current || 0
              }
            }

            const style: React.CSSProperties = {
              transform: `translate3d(0, ${translateY}px, 0)`,
              zIndex: isActive ? 50 : 'auto',
              userSelect: 'none',
              cursor: isActive ? 'grabbing' : 'grab',
              touchAction: 'none',
              transition:
                activeId && !isActive
                  ? 'transform 200ms cubic-bezier(0.2, 0.0, 0.2, 1), box-shadow 150ms ease, background-color 150ms ease, opacity 120ms ease'
                  : 'box-shadow 150ms ease, background-color 150ms ease, opacity 120ms ease'
            }

            return (
              <div
                key={item.id}
                ref={registerItem(item.id, index)}
                onPointerDown={handlePointerDown(item.id, index)}
                style={style}
                className={`rounded-xl border bg-slate-800/80 px-4 py-3 text-sm shadow-sm ${
                  isActive ? 'ring-2 ring-sky-500 shadow-lg bg-slate-800' : ''
                }`}
              >
                {item.text}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DragSortFlip
