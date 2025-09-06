import { HTMLAttributes, PropsWithChildren } from 'react'
import clsx from 'clsx'

import './style.less'

interface IconHoverProps extends HTMLAttributes<HTMLSpanElement> {}
export function IconWrapper(props: PropsWithChildren<IconHoverProps>) {
  const { children, className, ...rest } = props

  return (
    <span {...rest} className={clsx('rmst-icon-wrapper', className)}>
      {children}
    </span>
  )
}
