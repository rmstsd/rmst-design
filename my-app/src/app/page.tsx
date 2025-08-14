'use client'

import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Portal from '@rc-component/portal'

const isServer = typeof window === 'undefined'

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  return <Portal open>asdasd</Portal>

  if (!isMounted) {
    return null
  }

  let portalContainer = document.body

  return <>{createPortal(<div>Hello World</div>, portalContainer)}</>
}
