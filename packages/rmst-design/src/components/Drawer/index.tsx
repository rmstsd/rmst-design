import { PropsWithChildren } from 'react'
import { useAnTransition } from '../_util/hooks'
import { Mask } from '../Mask'
import { Portal } from '../Portal'
import { X } from 'lucide-react'
import { Button } from '../Button'

import './style.less'

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
            <header className="rmst-drawer-header">
              <div>标题</div>

              <Button className="rmst-drawer-header-close" icon={<X />} type="text" onClick={onCancel} />
            </header>

            <div className="rmst-drawer-body">{children}</div>
          </div>
        </div>
      </Portal>
    )
  )
}
