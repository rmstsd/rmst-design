import { useContext, useLayoutEffect, useRef } from 'react'

import { PortalContext } from './Host'

interface PortalProps {
  children?: React.ReactNode
}

const Portal = (props: PortalProps) => {
  const { children } = props
  const manager = useContext(PortalContext)

  const onlyKeyRef = useRef<number>(0)

  const firstRenderRef = useRef(true)

  useLayoutEffect(() => {
    if (!checkManager()) {
      return
    }

    if (firstRenderRef.current) {
      firstRenderRef.current = false

      checkManager()
      onlyKeyRef.current = manager.mount(children)

      return
    }

    manager.update(onlyKeyRef.current, children)
  })

  useLayoutEffect(() => {
    return () => {
      if (!checkManager()) {
        return
      }

      manager.unmount(onlyKeyRef.current)
    }
  }, [])

  const checkManager = () => {
    if (!manager) {
      console.error('Host 没有使用')

      return false
    }

    return true
  }

  return null
}

export default Portal
