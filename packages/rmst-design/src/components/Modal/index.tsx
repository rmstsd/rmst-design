import { PropsWithChildren } from 'react'
import { Mask } from '../Mask'
import { Portal } from '../Portal'

import { Button } from '../Button'
import { X } from 'lucide-react'

import './style.less'
import useOverflowHidden from '../_util/useOverflowHidden'
import { RmstViewTransition } from '../_util/RmstViewTransition'

interface ModalProps {
  open?: boolean
  onCancel?: () => void
  onExited?: () => void
}

export function Modal(props: PropsWithChildren<ModalProps>) {
  const { open, onCancel, onExited, children } = props

  useOverflowHidden({ hidden: open })

  const keyframes = [
    { opacity: 0, transform: 'translateY(100px) scale(0.9)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
  ]

  return (
    <Portal>
      <Mask open={open} style={{ zIndex: 1000 }} onClick={onCancel}></Mask>

      <RmstViewTransition open={open} keyframes={keyframes}>
        <div className="rmst-modal-content">
          <div className="rmst-modal-header">
            <div>标题</div>

            <Button className="close" type="text" icon={<X />} onClick={onCancel} />
          </div>

          <div className="rmst-modal-body">{children}</div>
        </div>
      </RmstViewTransition>
    </Portal>
  )
}
