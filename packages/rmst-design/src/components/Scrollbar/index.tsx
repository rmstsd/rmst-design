import clsx from 'clsx'
import { clamp } from 'es-toolkit'
import { HtmlHTMLAttributes, PropsWithChildren, useLayoutEffect, useRef, useState } from 'react'

import './style.less'

interface ScrollbarProps extends PropsWithChildren, HtmlHTMLAttributes<HTMLElement> {}

export function Scrollbar(props: ScrollbarProps) {
  const { children, ...htmlAttr } = props

  const [thumbHeight, setThumbHeight] = useState(0)
  const [ratio, setRatio] = useState(0)
  const visible = ratio < 1
  const [shadow, setShadow] = useState({ hasTop: false, hasBottom: false })

  const rootDomRef = useRef<HTMLDivElement>(null)
  const viewportDomRef = useRef<HTMLDivElement>(null)
  const contentDomRef = useRef<HTMLDivElement>(null)

  const thumbDomRef = useRef<HTMLDivElement>(null)
  const trackDomRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const viewportDom = viewportDomRef.current

    const onResize = () => {
      const ratio = viewportDom.clientHeight / viewportDomRef.current.scrollHeight
      setRatio(ratio)

      onScroll()
    }

    onResize()

    const ob = new ResizeObserver(onResize)
    ob.observe(rootDomRef.current)
    ob.observe(contentDomRef.current)

    return () => {
      ob.disconnect()
    }
  }, [])

  useLayoutEffect(() => {
    if (visible) {
      const h = ratio * trackDomRef.current.clientHeight
      setThumbHeight(h)
    }
  }, [visible, ratio])

  const setDomThumbY = (thumbY: number) => {
    thumbDomRef.current.style.setProperty('transform', `translateY(${thumbY}px)`)
  }

  const onThumbMouseDown = (evt: React.PointerEvent) => {
    evt.preventDefault()

    const abCt = new AbortController()

    const target = evt.target as HTMLElement
    target.setPointerCapture(evt.pointerId)

    const thumbDomDownOffsetY = evt.clientY - thumbDomRef.current.getBoundingClientRect().top
    const viewportDomRect = viewportDomRef.current.getBoundingClientRect()
    const trackDomRect = trackDomRef.current.getBoundingClientRect()
    const thumbDomRect = thumbDomRef.current.getBoundingClientRect()

    const onMove = (evt: MouseEvent) => {
      let thumbY = evt.clientY - trackDomRect.top - thumbDomDownOffsetY
      thumbY = clamp(thumbY, 0, trackDomRect.height - thumbDomRect.height)

      const scrollTop =
        (thumbY / (trackDomRect.height - thumbDomRect.height)) * (viewportDomRef.current.scrollHeight - viewportDomRect.height)

      viewportDomRef.current.scrollTo(0, scrollTop)
    }

    const onCancel = () => {
      abCt.abort()
    }

    document.addEventListener('pointermove', onMove, { signal: abCt.signal })
    document.addEventListener('pointerup', onCancel, { signal: abCt.signal })
    document.addEventListener('pointercancel', onCancel, { signal: abCt.signal })
  }

  const onScroll = () => {
    const viewportDom = viewportDomRef.current

    let r = viewportDom.scrollTop / (viewportDom.scrollHeight - viewportDom.clientHeight) // 可滚动的高度
    r = clamp(r, 0, 1)
    const y = r * (trackDomRef.current.clientHeight - thumbDomRef.current.clientHeight)

    setDomThumbY(y)

    setShadow({
      hasTop: viewportDom.scrollTop > 0,
      hasBottom: Math.round(viewportDom.scrollTop + viewportDom.clientHeight) < viewportDom.scrollHeight - 1
    })
  }

  return (
    <div {...htmlAttr} ref={rootDomRef} className={clsx('rmst-scrollbar', htmlAttr.className)}>
      <section
        className={clsx('rmst-scrollbar-view', {
          top: shadow.hasTop,
          bottom: shadow.hasBottom,
          all: shadow.hasTop && shadow.hasBottom
        })}
        ref={viewportDomRef}
        onScroll={onScroll}
      >
        <div ref={contentDomRef} className="content">
          {children}
        </div>
      </section>

      <div className="track" ref={trackDomRef} style={{ display: visible ? 'block' : 'none' }}>
        <div ref={thumbDomRef} className="thumb" style={{ height: thumbHeight }} onPointerDown={onThumbMouseDown} />
      </div>
    </div>
  )
}
