import clsx from 'clsx'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import './style.less'

const defaultProps = {
  rows: 1,
  expandable: true,
  defaultExpanded: false
}

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator?.userAgent ?? '')

export const TextEllipsis = baseProps => {
  const props = { ...defaultProps, ...baseProps }
  const { className, style, rows, disabled, children, expandable } = props

  const wrapperRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const mirrorContentRef = useRef<HTMLDivElement>(null)
  const mirrorTextRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(props.defaultExpanded)
  const [overflow, setOverflow] = useState(false)

  const single = useMemo(() => {
    if (Object.prototype.toString.call(expandable) === '[object Object]') {
      return !expandable.single && rows === 1
    }
    return rows === 1
  }, [rows, expandable])

  useLayoutEffect(() => {
    onResize()
  }, [children, textRef])

  useEffect(() => {
    const ob = new ResizeObserver(() => {
      onResize()
    })

    if (mirrorContentRef.current) ob.observe(mirrorContentRef.current)
    if (mirrorTextRef.current) ob.observe(mirrorTextRef.current)

    return () => {
      ob.disconnect()
    }
  }, [])

  const prefix = 'ellipsis'

  const renderActionContent = () => {
    return <span className={`${prefix}-action-text`}>{expanded ? '收起' : '展开'}</span>
  }

  const renderAction = () => {
    if (expandable && overflow) {
      return (
        <div
          className={clsx(`${prefix}-action`, {
            [`${prefix}-action-collapsed`]: !expanded
          })}
          onClick={() => setExpanded(!expanded)}
        >
          {renderActionContent()}
        </div>
      )
    }
    return null
  }

  const onResize = () => {
    if (mirrorTextRef.current && mirrorContentRef.current) {
      const isOverflow = single
        ? mirrorTextRef.current.offsetWidth > mirrorContentRef.current.offsetWidth
        : mirrorTextRef.current.offsetHeight > mirrorContentRef.current.offsetHeight

      console.log(isOverflow)
      setOverflow(isOverflow)
    }
  }

  const renderMirror = () => {
    if (disabled) {
      return null
    }

    return (
      <div
        className={
          single
            ? clsx(`${prefix}-content-mirror`, `${prefix}-single`)
            : clsx(`${prefix}-content-mirror`, `${prefix}-multiple`, `${prefix}-collapsed`)
        }
        style={{ WebkitBoxOrient: 'vertical', MozBoxOrient: 'vertical', WebkitLineClamp: rows }}
        ref={mirrorContentRef}
      >
        <span ref={mirrorTextRef} className={`${prefix}-text`}>
          {children}
        </span>
      </div>
    )
  }

  const renderContent = () => {
    if (single) {
      return (
        <div className={clsx(`${prefix}-content`, `${prefix}-single`)}>
          <span ref={textRef} className={`${prefix}-text`}>
            {children}
          </span>
        </div>
      )
    }
    if (isSafari) {
      return (
        <div
          className={clsx(`${prefix}-content`, `${prefix}-multiple`)}
          // title={!tooltipData.tooltip && overflow && !expanded ? text : undefined}
        >
          {!expanded && renderAction()}
          <span
            ref={textRef}
            className={clsx(`${prefix}-text`, {
              [`${prefix}-collapsed`]: !expanded
            })}
            style={{
              WebkitBoxOrient: 'vertical',
              MozBoxOrient: 'vertical',
              WebkitLineClamp: rows
            }}
          >
            {children}
          </span>
          {expanded && renderAction()}
        </div>
      )
    }

    return (
      <div
        className={clsx(`${prefix}-content`, `${prefix}-multiple`, {
          [`${prefix}-collapsed`]: !expanded
        })}
        style={{
          WebkitBoxOrient: 'vertical',
          MozBoxOrient: 'vertical',
          WebkitLineClamp: rows
        }}
        // title={!tooltipData.tooltip && overflow && !expanded ? text : undefined}
      >
        {!expanded && renderAction()}
        <span ref={textRef} className={`${prefix}-text`}>
          {children}
        </span>
        {expanded && renderAction()}
      </div>
    )
  }

  const renderWrapper = () => {
    if (disabled) {
      return (
        <div className={`${prefix}-content`}>
          <span ref={textRef} className={`${prefix}-text`}>
            {children}
          </span>
        </div>
      )
    }

    return renderContent()
  }

  return (
    <div ref={wrapperRef} className={clsx(prefix, className)} style={style}>
      {renderMirror()}
      {renderWrapper()}
    </div>
  )
}
