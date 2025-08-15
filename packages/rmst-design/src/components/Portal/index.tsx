import { PropsWithChildren, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useIsSSR } from '../_util'

export function Portal(props: PropsWithChildren) {
  const { children } = props

  const isSSR = useIsSSR()

  if (isSSR) {
    return null
  }

  return createPortal(children, document.body)
}
