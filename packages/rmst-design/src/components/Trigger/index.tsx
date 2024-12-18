import React, { CSSProperties, isValidElement, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { mergeRefs } from 'react-merge-refs'
import { getPlacement, getPopupPosition } from './utils'

import './style.less'
import { mergeProps, useAnTransition, useMergeValue } from '../_util/hooks'

type TriggerProps = {
  popup?: ReactNode
  children?: ReactNode
  autoAlignPopupWidth?: boolean
  visible?: boolean
  onChange?: (visible: boolean) => void
}

const defaultProps: TriggerProps = {
  autoAlignPopupWidth: false
}

export function Trigger(props: TriggerProps) {
  props = mergeProps(defaultProps, props)

  const { visible, onChange, popup, children, autoAlignPopupWidth } = props

  const [popupVisible, setPopupVisible] = useMergeValue(visible)

  const [popupStyle, setPopupStyle] = useState<CSSProperties>({})

  const triggerRef = useRef<HTMLElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const triggerElement = getTriggerElement(children)
  const triggerProps = triggerElement.props

  const childElement = React.cloneElement(triggerElement, {
    ref: mergeRefs([triggerProps.ref, triggerRef]),
    onClick: evt => {
      const newValue = !popupVisible
      if (!Reflect.has(props, 'visible')) {
        setPopupVisible(newValue)
      }

      onChange?.(newValue)

      triggerProps.onClick?.(evt)
    }
  })

  useEffect(() => {
    const docClick = evt => {
      const target = evt.target as HTMLElement
      if (triggerRef.current.contains(target) || (popupRef.current && popupRef.current.contains(target))) {
        return
      }

      if (!Reflect.has(props, 'visible')) {
        setPopupVisible(false)
      }

      onChange?.(false)
    }

    document.addEventListener('click', docClick)

    return () => {
      document.removeEventListener('click', docClick)
    }
  }, [])

  useLayoutEffect(() => {
    if (popupVisible) {
      const plc = getPlacement(triggerRef.current, popupRef.current)
      const pos = getPopupPosition(triggerRef.current, popupRef.current, plc, false, autoAlignPopupWidth)

      setPopupStyle(pos)
    }
  }, [popupVisible])

  const { shouldMount, domRef } = useAnTransition({
    open: popupVisible,
    Keyframes: [
      { opacity: 0, transformOrigin: '0 0', transform: 'scaleY(0.9) translateZ(0)' },
      { opacity: 1, transformOrigin: '0 0', transform: 'scaleY(1) translateZ(0)' }
    ]
  })

  return (
    <>
      {childElement}

      {shouldMount &&
        createPortal(
          <div className="rmst-popup-root">
            <div className="rmst-popup-content" ref={mergeRefs([popupRef, domRef])} style={popupStyle}>
              {popup}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

const getTriggerElement = (children): any => {
  if (isValidElement(children)) {
    return children
  }

  return <span>{children}</span>
}
