import { PropsWithChildren, useLayoutEffect, useRef } from 'react'
import { Mask } from '../Mask'
import { Portal } from '../Portal'
import { useAnTransition } from '../_util/hooks'

import { Button } from '../Button'
import { X } from 'lucide-react'

import './style.less'
import useOverflowHidden from '../_util/useOverflowHidden'

interface ModalProps {
  open?: boolean
  onCancel?: () => void
}

export function Modal(props: PropsWithChildren<ModalProps>) {
  const { open, onCancel, children } = props

  const pointerDownDomRef = useRef(null)
  const isClickMaskRef = useRef(false)

  useOverflowHidden({ hidden: open })

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
              <div className="rmst-modal-header">
                <div>标题</div>

                <Button className="close" type="text" icon={<X />} onClick={onCancel} />
              </div>

              <div className="rmst-modal-body">{children}</div>
            </div>
          </div>
        </div>
      </Portal>
    )
  )
}
