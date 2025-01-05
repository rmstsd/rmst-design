import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'

import './style.less'

const cs = clsx

const defaultProps = {
  rows: 1,
  expandable: true,
  defaultExpanded: false
}

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator?.userAgent ?? '')

export const TextEllipsis = baseProps => {
  const props = { ...defaultProps, ...baseProps }
  const { className, style, rows, disabled, children, expandable, expandRender, onEllipsis } = props

  const wrapperRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const mirrorContentRef = useRef<HTMLDivElement>(null)
  const mirrorTextRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflow, setOverflow] = useState(false)

  const single = useMemo(() => {
    if (typeof expandable === 'object') {
      return !expandable.single && rows === 1
    }
    return rows === 1
  }, [rows, expandable])

  useEffect(() => {
    if (textRef.current) {
      // const content = textRef.current.textContent
    }
  }, [children, textRef])

  const prefix = 'ellipsis'

  const renderActionContent = () => {
    if (expandRender) {
      return expandRender(expanded)
    }
    return <span className={`${prefix}-action-text`}>{expanded ? '展开' : '收起'}</span>
  }

  const renderAction = () => {
    if (1 && overflow) {
      return (
        <div
          className={cs(`${prefix}-action`, {
            [`${prefix}-action-collapsed`]: !expanded
          })}
          onClick={() => {
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

  useEffect(() => {
    onResize()
  }, [])

  const onResize = () => {
    if (mirrorTextRef.current && mirrorContentRef.current) {
      const isOverflow = single
        ? mirrorTextRef.current.offsetWidth > mirrorContentRef.current.offsetWidth
        : mirrorTextRef.current.offsetHeight > mirrorContentRef.current.offsetHeight
      if (isOverflow) {
        if (overflow === false) {
          setOverflow(true)
          onEllipsis?.(true)
        }
      } else if (overflow === true) {
        setOverflow(false)
        onEllipsis?.(false)
      }
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
            ? cs(`${prefix}-content-mirror`, `${prefix}-single`)
            : cs(`${prefix}-content-mirror`, `${prefix}-multiple`, `${prefix}-collapsed`)
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
        <div className={cs(`${prefix}-content`, `${prefix}-single`)}>
          <span ref={textRef} className={`${prefix}-text`}>
            {children}
          </span>
        </div>
      )
    }
    if (isSafari) {
      return (
        <div className={cs(`${prefix}-content`, `${prefix}-multiple`)}>
          {!expanded && renderAction()}
          <span
            ref={textRef}
            className={cs(`${prefix}-text`, {
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
        className={cs(`${prefix}-content`, `${prefix}-multiple`, {
          [`${prefix}-collapsed`]: !expanded
        })}
        style={{
          WebkitBoxOrient: 'vertical',
          MozBoxOrient: 'vertical',
          WebkitLineClamp: rows
        }}
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
    <div ref={wrapperRef} className={cs(prefix, className)} style={style}>
      {renderMirror()}
      {renderWrapper()}
    </div>
  )
}
