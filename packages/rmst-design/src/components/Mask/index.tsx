import React from 'react'
import './style.less'
import { useAnTransition } from '../_util/hooks'
import { Portal } from '../Portal'

interface MaskProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  isRenderToBody?: boolean
}

export function Mask(props: MaskProps) {
  const { open, isRenderToBody, className, ...rest } = props

  const Keyframes = [{ opacity: 0 }, { opacity: 1 }]

  const { shouldMount, domRef } = useAnTransition({ open, Keyframes })

  return shouldMount ? (
    <Portal>
      <div {...rest} className="mask" ref={domRef}></div>
    </Portal>
  ) : null
}
