import { cn } from '@/utils/cn'
import { configure } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { PointerEvent, useLayoutEffect, useRef } from 'react'
import { startDrag } from 'rmst-design'
import { initialItems } from './claude-sort'
import { useVirtualizer } from '@tanstack/react-virtual'
import { isNil } from 'es-toolkit'

configure({ enforceActions: 'never' })

class Rect {
  constructor(
    el: HTMLDivElement,
    private scrollContainer: HTMLDivElement
  ) {
    const rect = el.getBoundingClientRect().toJSON()

    const ty = new DOMMatrix(getComputedStyle(el).transform).f

    rect.top -= ty
    rect.bottom -= ty

    this.rect = rect

    this.scrollTop = scrollContainer.scrollTop
  }

  private scrollTop = 0

  private rect: DOMRect

  get top() {
    // 在读取 rect.top 的时候获取所有可滚动祖先的 scrollTop 的和
    const currentOffsets = this.scrollTop
    const scrollOffsetsDeltla = this.scrollContainer.scrollTop - currentOffsets

    return this.rect.top + scrollOffsetsDeltla
  }

  get bottom() {
    // 在读取 rect.top 的时候获取所有可滚动祖先的 scrollTop 的和
    const currentOffsets = this.scrollTop
    const scrollOffsetsDeltla = this.scrollContainer.scrollTop - currentOffsets
    return this.rect.bottom + scrollOffsetsDeltla
  }

  get height() {
    return this.rect.height
  }

  get width() {
    return this.rect.width
  }

  toJSON() {
    return {
      top: this.top,
      bottom: this.bottom,
      height: this.height,
      width: this.width
    }
  }
}

export const DragSortMy = observer(() => {
  const state = useLocalObservable(() => {
    return {
      items: initialItems,
      activeIndex: null,
      activeId: null,
      activeRect: null, // 虚拟滚动的时候， active dom 会销毁

      overIndex: null,
      translateY: [],

      dragState: {
        down_clientY: 0,
        down_scrollTop: 0,
        move_clientY: 0,

        offsetTop: null,
        offsetBottom: null
      }
    }
  })

  const containerRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: state.items.length,
    getScrollElement: () => containerRef.current,
    estimateSize: index => 70,
    // gap: 10,
    getItemKey: index => state.items[index].id,
    overscan: 0
  })

  const domRectMapRef = useRef<Map<string, Rect>>(new Map())
  const domMapRef = useRef<Map<string, HTMLDivElement>>(new Map())
  const setDomRef = (id, el) => {
    domMapRef.current.set(id, el)

    setTimeout(() => {
      measureAll()
    })
  }
  const removeDomRef = id => {
    domMapRef.current.delete(id)
    domRectMapRef.current.delete(id)
  }

  const measureAll = () => {
    const container = containerRef.current as HTMLDivElement

    for (const [id, el] of domMapRef.current) {
      const rect = new Rect(el, container)
      domRectMapRef.current.set(id, rect)
    }
  }

  const handlePointerDown = async (downEvt: PointerEvent, id: string, index: number) => {
    state.dragState.down_clientY = downEvt.clientY
    state.dragState.move_clientY = downEvt.clientY
    state.activeIndex = index
    state.activeId = id
    state.activeRect = domRectMapRef.current.get(id).toJSON()

    const container = document.getElementById('rmst-container')
    const containerRect = container.getBoundingClientRect()
    state.dragState.down_scrollTop = container.scrollTop

    measureAll()

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
        // if (state.overIndex !== state.activeIndex) {
        // }

        reset()
      },
      onPointerUp: () => {
        reset()
      }
    })

    const reset = () => {
      state.activeIndex = null
      state.overIndex = null
      state.activeId = null
      state.activeRect = null
      state.translateY = []

      state.dragState.move_clientY = 0
      state.dragState.down_clientY = 0
      state.dragState.down_scrollTop = 0
      state.dragState.offsetTop = null
      state.dragState.offsetBottom = null

      speedRef.current = 0

      cancelAnimationFrame(rafId.current)
    }
  }

  const calcTranslateY = () => {
    let { down_clientY, down_scrollTop, move_clientY } = state.dragState

    const container = containerRef.current
    const dy = container.scrollTop - down_scrollTop
    move_clientY += dy

    const domRectMap = domRectMapRef.current
    const rects = Array.from(domRectMapRef.current).map(([id, rect]) => ({ id, rect: rect.toJSON() }))
    // console.log(rects.sort((a, b) => a.rect.top - b.rect.top).map(p => Math.round(p.rect.top)))

    // 寻找到最近的一个元素
    const over = rects.reduce(
      (closest, item) => {
        const center = item.rect.top + item.rect.height / 2
        const distance = Math.abs(move_clientY - center)
        return distance < closest.distance ? { id: item.id, distance } : closest
      },
      { id: null, distance: Infinity }
    )

    const overIndex = state.items.findIndex(item => item.id === over.id)
    console.log(overIndex)

    state.overIndex = overIndex
    const { activeIndex, activeId } = state

    const translateY = state.items.map(() => 0)
    if (overIndex > activeIndex) {
      const nextId = state.items[activeIndex + 1].id

      if (isNil(state.dragState.offsetTop)) {
        state.dragState.offsetTop = state.activeRect.top - domRectMap.get(nextId).top
      }

      for (let i = activeIndex + 1; i <= overIndex; i++) {
        translateY[i] = state.dragState.offsetTop
      }
    } else if (overIndex < activeIndex) {
      const prevId = state.items[activeIndex - 1].id

      if (isNil(state.dragState.offsetBottom)) {
        state.dragState.offsetBottom = state.activeRect.bottom - domRectMap.get(prevId).bottom
      }

      for (let i = activeIndex - 1; i >= overIndex; i--) {
        translateY[i] = state.dragState.offsetBottom
      }
    } else if (overIndex === activeIndex) {
    }

    // translateY[activeIndex] = move_clientY - down_clientY

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

  const renderActive = () => {
    if (state.activeId) {
      return (
        <div
          className=" fixed rounded-xl touch-none bg-slate-500 px-4 py-3 text-sm shadow-sm text-white select-none"
          style={{
            left: 0,
            top: state.dragState.move_clientY
          }}
        >
          {state.activeId}
        </div>
      )
    }

    return null
  }

  return (
    <div className="rmstsd-dsm-c m-10" style={{ width: 300 }}>
      <div id="rmst-container" ref={containerRef} className="overflow-auto" style={{ height: 600 }}>
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
          {virtualizer.getVirtualItems().map(virtualRow => {
            return (
              <SortItem
                key={virtualRow.index}
                state={state}
                virtualRow={virtualRow}
                virtualizer={virtualizer}
                setDomRef={setDomRef}
                removeDomRef={removeDomRef}
                handlePointerDown={handlePointerDown}
                domRectMapRef={domRectMapRef}
                containerRef={containerRef}
              />
            )
          })}
        </div>
      </div>

      {renderActive()}
    </div>
  )
})

// 不能在 onDragMove 中调用 reCalc, 因为 transform 和 动画的存在 会导致 getBoundingClientRect 不准确

const SortItem = observer<any>(props => {
  const { state, virtualRow, virtualizer, setDomRef, removeDomRef, handlePointerDown, domRectMapRef, containerRef } = props

  const index = virtualRow.index
  const item = state.items[index]
  const isActive = state.activeIndex === index

  const domRef = useRef<HTMLDivElement>(null)

  const style: React.CSSProperties = {
    height: 100,
    position: 'absolute',
    top: virtualRow.start,
    left: 0,
    width: '100%',
    transition: isActive ? 'none' : 'transform 0.3s',
    transform: `translateY(${state.translateY[index] ?? 0}px)`
  }

  useLayoutEffect(() => {
    // 有新元素进来后, 全都重新测量
    setDomRef(item.id, domRef.current)

    return () => {
      removeDomRef(item.id)
    }
  }, [])

  return (
    <div
      key={item.id}
      data-index={virtualRow.index}
      ref={el => {
        virtualizer.measureElement(el)
        domRef.current = el
      }}
      style={style}
      onPointerDown={evt => handlePointerDown(evt, item.id, index)}
      className={cn(
        'rounded-xl touch-none bg-slate-500 px-4 py-3 text-sm shadow-sm text-white select-none border-b border-red-300',
        isActive ? 'invisible' : ''
      )}
    >
      <div className="mt-2">{item.id}</div>
      <div className="mt-2">{item.text.slice(0, 10)}</div>
    </div>
  )
})
