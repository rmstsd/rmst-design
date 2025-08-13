import { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { isSsr } from '../_util/ssr'

export function Portal(props: PropsWithChildren) {
  const { children } = props

  if (isSsr) {
    return null
  }

  return createPortal(children, document.body)
}
