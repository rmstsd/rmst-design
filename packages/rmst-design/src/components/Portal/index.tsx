import { PropsWithChildren, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function Portal(props: PropsWithChildren) {
  const { children } = props

  const [isMounted, setIsMounted] = useState(false)

  useLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return createPortal(children, document.body)
}
