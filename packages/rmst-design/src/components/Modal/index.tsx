import React, { PropsWithChildren } from 'react'
import './style.less'
import { Mask } from '../Mask'
import { Portal } from '../Portal'
import { useAnTransition } from '../_util/hooks'

interface ModalProps {
  open?: boolean
  onCancel?: () => void
}

export function Modal(props: PropsWithChildren<ModalProps>) {
  const { open, onCancel, children } = props

  const onClickMask = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.target === evt.currentTarget) {
      onCancel?.()
    }
  }

  const Keyframes = [
    { opacity: 0, transform: 'translateY(100px) scale(0.8)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
  ]
  const { shouldMount, domRef } = useAnTransition({ open, Keyframes })

  return (
    shouldMount && (
      <Portal>
        <div>
          <Mask open={open}></Mask>
          <div className="rmst-modal" onClick={onClickMask}>
            <div className="rmst-modal-content" ref={domRef}>
              rmst-modal
            </div>
          </div>
        </div>
      </Portal>
    )
  )
}
