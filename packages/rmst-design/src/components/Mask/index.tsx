import React from 'react'
import { useAnTransition } from '../_util/hooks'
import { Portal } from '../Portal'

import './style.less'

interface MaskProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  isRenderToBody?: boolean
}

export function Mask(props: MaskProps) {
  const { open, isRenderToBody, className, ...rest } = props

  const keyframes = [{ opacity: 0 }, { opacity: 1 }]

  const { shouldMount, setDomRef } = useAnTransition({ open, keyframes })

  if (shouldMount) {
    const maskElement = <div {...rest} className="mask" ref={setDomRef}></div>

    if (isRenderToBody) {
      return <Portal>{maskElement}</Portal>
    }

    return maskElement
  }

  return null
}
