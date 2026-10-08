import React, { startTransition, useLayoutEffect, useState, ViewTransition } from 'react'
import { Portal } from '../Portal'

import './style.less'
import { RmstViewTransition } from '../_util/RmstViewTransition'

interface MaskProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  isRenderToBody?: boolean
}

const keyframes = [{ opacity: 0 }, { opacity: 1 }]
export function Mask(props: MaskProps) {
  const { open, isRenderToBody, className, ...rest } = props

  if (open) {
    const maskElement = (
      <RmstViewTransition keyframes={keyframes} open={open}>
        <div {...rest} className="mask"></div>
      </RmstViewTransition>
    )

    if (isRenderToBody) {
      return <Portal>{maskElement}</Portal>
    }

    return maskElement
  }

  return null
}
