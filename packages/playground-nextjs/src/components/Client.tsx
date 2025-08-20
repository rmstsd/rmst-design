'use client'

import { PropsWithChildren } from 'react'
import { useIsSSR } from 'rmst-design'

export default function ClientWrapper(props: PropsWithChildren) {
  return props.children
}

export const OnlyClient = (props: PropsWithChildren) => {
  const isSSR = useIsSSR()

  if (isSSR) {
    return null
  }

  return props.children
}
