import React from 'react'
import { Portal } from '../Portal'

import './style.less'
import { RmstViewTransition } from '../_util/RmstViewTransition'

interface MaskProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  isRenderToBody?: boolean
}

const enterKeyframes = [{ opacity: 0 }, { opacity: 1 }]
const exitKeyframes = [{ opacity: 1 }, { opacity: 0 }]
export function Mask(props: MaskProps) {
  const { open, isRenderToBody, className, ...rest } = props

  const maskElement = (
    <RmstViewTransition enterKeyframes={enterKeyframes} exitKeyframes={exitKeyframes} open={open}>
      <div {...rest} className={[className, 'mask'].filter(Boolean).join(' ')}></div>
    </RmstViewTransition>
  )

  if (isRenderToBody) {
    return <Portal>{maskElement}</Portal>
  }

  return maskElement
}
