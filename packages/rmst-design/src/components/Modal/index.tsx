import { PropsWithChildren, useRef } from 'react'
import { Mask } from '../Mask'
import { Portal } from '../Portal'
import { useAnTransition } from '../_util/hooks'

import './style.less'

interface ModalProps {
  open?: boolean
  onCancel?: () => void
}

export function Modal(props: PropsWithChildren<ModalProps>) {
  const { open, onCancel, children } = props

  const pointerDownDomRef = useRef(null)
  const isClickMaskRef = useRef(false)

  const onClickMask = () => {
    onCancel?.()
  }

  const keyframes = [
    { opacity: 0, transform: 'translateY(100px) scale(0.8)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
  ]
  const { shouldMount, setDomRef } = useAnTransition({ open, keyframes })

  return (
    shouldMount && (
      <Portal>
        <div className="rmst-modal-wrapper">
          <Mask open={open}></Mask>
          <div
            className="rmst-modal"
            onPointerDown={evt => {
              pointerDownDomRef.current = evt.target
            }}
            onPointerUp={evt => {
              isClickMaskRef.current = pointerDownDomRef.current === evt.target && evt.target === evt.currentTarget
              if (isClickMaskRef.current) {
                onClickMask()
              }
            }}
          >
            <div className="rmst-modal-content" ref={setDomRef}>
              {children}
            </div>
          </div>
        </div>
      </Portal>
    )
  )
}
