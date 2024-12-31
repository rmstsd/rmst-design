import { useLayoutEffect, useRef, useState } from 'react'
import './sty.less'
import clsx from 'clsx'

export default function My({ rows }: { rows: number }) {
  const [open, setOpen] = useState(false)
  const [isOverflow, setIsOverflow] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  const [lh, setLh] = useState(21)

  useLayoutEffect(() => {
    const { fontSize, lineHeight } = getComputedStyle(contentRef.current)

    if (lineHeight === 'normal') {
      setLh(parseFloat(fontSize) * 1.3)
    } else {
      setLh(parseFloat(lineHeight))
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

  const onResize = () => {
    setIsOverflow(contentRef.current.scrollHeight > contentRef.current.clientHeight)
  }

  const renderAction = () => {
    if (!isOverflow) {
      return null
    }

    const epBtn = (
      <span className="show-btn" onClick={() => setOpen(!open)}>
        {open ? '收起' : '展开'}
      </span>
    )

    return epBtn
  }

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <div className="mirror" style={{ position: 'absolute', visibility: 'hidden' }}>
        <div className={clsx('my', 'multi-ell')} ref={contentRef} style={{ WebkitLineClamp: rows }}>
          上面虽然完成了右下加环绕，但是高度是固定的，如何动态设置呢？这里可以用到
          但是高度是固定的，如何动态设置呢？这里可以用到
        </div>
      </div>

      <div className={clsx('my', !open && 'multi-ell')} style={{ WebkitLineClamp: rows }}>
        {!open && <span className="plc" style={{ height: `calc(100% - ${lh}px)` }}></span>}
        {!open && renderAction()}
        上面虽然完成了右下加环绕，但是高度是固定的，如何动态设置呢？这里可以用到
        但是高度是固定的，如何动态设置呢？这里可以用到
        {open && renderAction()}
      </div>
    </div>
  )
}
