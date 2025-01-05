import { HTMLAttributes, PropsWithChildren } from 'react'

import './style.less'

interface IconHoverProps extends HTMLAttributes<HTMLSpanElement> {}
export function IconWrapper(props: PropsWithChildren<IconHoverProps>) {
  const { children, className, ...rest } = props

  return (
    <span {...rest} className="icon-wrapper">
      {children}
    </span>
  )
}
