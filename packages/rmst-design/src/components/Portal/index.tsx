import { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

export function Portal(props: PropsWithChildren) {
  const { children } = props

  return createPortal(children, document.body)
}
