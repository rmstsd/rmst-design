import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'

import './style.less'

const defaultProps = {
  rows: 1,
  expandable: true,
  defaultExpanded: false
}

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator?.userAgent ?? '')

export const TextEllipsis = baseProps => {
  const props = { ...defaultProps, ...baseProps }
  const { className, style, rows, disabled, children, expandable, expandRender } = props

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

  useEffect(() => {
    onResize()
  }, [children, textRef])

  useEffect(() => {
    const ob = new ResizeObserver(() => {
      onResize()
    })

    ob.observe(mirrorContentRef.current)
    ob.observe(mirrorTextRef.current)
  }, [])

  const prefix = 'ellipsis'

  const renderActionContent = () => {
    if (expandRender) {
      return expandRender(expanded)
    }
    return <span className={`${prefix}-action-text`}>{expanded ? '收起' : '展开'}</span>
  }

  const renderAction = () => {
    if (expandable && overflow) {
      return (
        <div
          className={clsx(`${prefix}-action`, {
            [`${prefix}-action-collapsed`]: !expanded
          })}
          onClick={ev => {
            if (expanded) {
              setExpanded(false)
            } else {
              setExpanded(true)
            }
          }}
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
        style={{
          WebkitBoxOrient: 'vertical',
          MozBoxOrient: 'vertical',
          WebkitLineClamp: rows
        }}
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
