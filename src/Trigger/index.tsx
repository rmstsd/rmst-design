import React, { CSSProperties, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { mergeRefs } from 'react-merge-refs'
import { getPlacement, getPopupPosition } from './utils'

import './style.less'

type TriggerProps = {
  popup: ReactNode
  children: ReactNode
}

export default function Trigger(props: TriggerProps) {
  const { popup, children } = props

  const [popupVisible, setPopupVisible] = useState(false)
  const [popupStyle, setPopupStyle] = useState<CSSProperties>({})

  const triggerRef = useRef<HTMLElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const childElement = React.cloneElement(children, {
    ref: mergeRefs([children.props.ref, triggerRef]),
    onClick: () => {
      setPopupVisible(!popupVisible)
    }
  })

  useEffect(() => {
    const docClick = evt => {
      const target = evt.target as HTMLElement
      if (target === triggerRef.current || (popupRef.current && popupRef.current.contains(target))) {
        return
      }

      setPopupVisible(false)
    }

    document.addEventListener('click', docClick)

    return () => {
      document.removeEventListener('click', docClick)
    }
  }, [])

  useLayoutEffect(() => {
    const plc = getPlacement(triggerRef.current, popupRef.current)
    const pos = getPopupPosition(triggerRef.current, popupRef.current, plc, false)

    setPopupStyle(pos)
  }, [popupVisible])

  return (
    <>
      {childElement}

      {popupVisible &&
        createPortal(
          <div className="rmst-popup-root">
            {/* <div className="rmst-mask" onClick={() => setPopupVisible(false)}></div> */}

            <div className="rmst-popup-content" ref={popupRef} style={popupStyle}>
              {popup}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
