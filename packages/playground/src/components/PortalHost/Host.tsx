import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'

interface PortalItem {
  key: number
  jsx: React.ReactNode
}

interface PortalContextValue {
  mount: (jsx: React.ReactNode) => number
  update: (key: number, jsx: React.ReactNode) => void
  unmount: (key: number) => void
}

export const PortalContext = React.createContext<PortalContextValue>(null)

interface HostProps {
  children?: React.ReactNode
}

const Host = (props: HostProps) => {
  const [list, setList] = useState<PortalItem[]>([])
  const queueRef = useRef<PortalItem[]>([])
  const nextKeyRef = useRef(10000)

  useLayoutEffect(() => {
    if (queueRef.current.length) {
      setList(queueRef.current)

      queueRef.current = []
    }
  }, [])

  const mount = (jsx: React.ReactNode) => {
    nextKeyRef.current += 1

    const item = { key: nextKeyRef.current, jsx }

    setList(state => state.concat(item))
    return nextKeyRef.current
  }

  const update = (key: number, jsx: React.ReactNode) => {
    setList(state => state.map(item => (item.key === key ? { ...item, jsx } : item)))
  }

  const unmount = (key: number) => {
    setList(state => state.filter(item => item.key !== key))
  }

  const value = useMemo(() => ({ mount, update, unmount }), [])

  return (
    <PortalContext.Provider value={value}>
      {props.children}

      {list.map(item => (
        <React.Fragment key={item.key}>{item.jsx}</React.Fragment>
      ))}
    </PortalContext.Provider>
  )
}

export default Host
