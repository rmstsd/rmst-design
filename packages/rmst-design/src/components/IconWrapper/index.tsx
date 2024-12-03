import { HTMLAttributes, PropsWithChildren } from 'react'
import CloseIcon from '../../icons/close'

import './style.less'

interface IconHoverProps extends HTMLAttributes<HTMLSpanElement> {}
export function IconWrapper(props: PropsWithChildren<IconHoverProps>) {
  const { children, className, ...rest } = props

  return (
    <span {...rest} className="icon-wrapper">
      <CloseIcon />
    </span>
  )
}
