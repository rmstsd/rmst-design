import { PropsWithChildren } from 'react'
import './style.less'
import { useAnTransition } from '../_util/hooks'
import { Mask } from '../Mask'
import { Portal } from '../Portal'

interface DrawerProps {
  open?: boolean
  onCancel?: () => void
}

export function Drawer(props: PropsWithChildren<DrawerProps>) {
  const { open, onCancel, children } = props

  const { shouldMount, setDomRef } = useAnTransition({
    open,
    keyframes: [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }]
  })

  return (
    shouldMount && (
      <Portal>
        <div className="rmst-drawer-wrapper">
          <Mask open={open} onClick={onCancel}></Mask>
          <div ref={setDomRef} className="rmst-drawer">
            {children}
          </div>
        </div>
      </Portal>
    )
  )
}
