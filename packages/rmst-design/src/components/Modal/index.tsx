import React, { PropsWithChildren } from 'react'
import './style.less'
import { Mask } from '../Mask'
import { Portal } from '../Portal'

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

  return (
    <>
      <Mask open={open}></Mask>

      {open && (
        <Portal>
          <div className="rmst-modal" onClick={onClickMask}>
            <div className="rmst-modal-content"></div>
          </div>
        </Portal>
      )}
    </>
  )
}
