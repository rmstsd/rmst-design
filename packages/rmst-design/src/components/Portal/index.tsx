import { PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useIsSSR } from '../_util'

export function Portal(props: PropsWithChildren) {
  const { children } = props

  const isSSR = useIsSSR()
  const domRef = useRef<HTMLElement>(null)

  if (!domRef.current && !isSSR) {
    domRef.current = document.createElement('div')
    document.body.appendChild(domRef.current)
  }

  useEffect(() => {
    return () => {
      domRef.current?.remove()
    }
  }, [])

  if (isSSR) {
    return null
  }

  return createPortal(children, domRef.current)
}
