import { PropsWithChildren, use, useLayoutEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import ConfigContext from '../_util/ConfigProvider'

import './style.less'

interface TextEllipsisProps extends PropsWithChildren {
  rows?: number
}

export function TextEllipsis(props: TextEllipsisProps) {
  const { rows, children } = props
  const [open, setOpen] = useState(false)
  const [isOverflow, setIsOverflow] = useState(false)

  const { prefixCls } = use(ConfigContext)

  const contentRef = useRef<HTMLDivElement>(null)

  const [lineHeight, setLineHeight] = useState(21)

  useLayoutEffect(() => {
    const { fontSize, lineHeight } = getComputedStyle(contentRef.current)

    if (lineHeight === 'normal') {
      setLineHeight(parseFloat(fontSize) * 1.2)
    } else {
      setLineHeight(parseFloat(lineHeight))
    }

    onResize()
    const ob = new ResizeObserver(() => {
      onResize()
    })
    ob.observe(contentRef.current)

    return () => {
      ob.disconnect()
    }
  }, [])

  const domRef = useRef<HTMLDivElement>(null)
  const f = useRef(0)

  const onResize = () => {
    setIsOverflow(contentRef.current.scrollHeight > contentRef.current.clientHeight)
  }

  const firstRenderRef = useRef(true)
  useLayoutEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    if (open) {
      const l = domRef.current.offsetHeight

      domRef.current.animate([{ height: `${f.current}px` }, { height: `${l}px` }], { duration: 100, easing: 'ease-in' })
    } else {
      const l = domRef.current.offsetHeight

      domRef.current.animate([{ height: `${f.current}px` }, { height: `${l}px` }], { duration: 100, easing: 'ease-in' })
    }
  }, [open])

  const renderAction = () => {
    if (!isOverflow) {
      return null
    }

    const epBtn = (
      <span
        className="action-btn"
        onClick={() => {
          const nv = !open
          setOpen(nv)
          f.current = domRef.current.offsetHeight
        }}
      >
        {open ? '收起' : '展开'}
      </span>
    )

    return epBtn
  }

  return (
    <div className={clsx(`${prefixCls}-text-ellipsis`)}>
      <div className={`${prefixCls}-mirror multi-ell`} ref={contentRef} style={{ WebkitLineClamp: rows }}>
        {children}
      </div>

      <div
        className={clsx(!open && 'real-rendered multi-ell')}
        style={{ WebkitLineClamp: rows, overflow: 'hidden' }}
        ref={domRef}
      >
        {!open && <span className="plc" style={{ height: `calc(100% - ${lineHeight}px)` }}></span>}
        {!open && renderAction()}
        {children}
        {open && renderAction()}
      </div>
    </div>
  )
}
