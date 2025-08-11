'use client'

import { PropsWithChildren, RefObject, use } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'

import './style/style.less'
import clsx from 'clsx'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement>, PropsWithChildren, InteractProps {
  ref?: RefObject<HTMLButtonElement>
  type?: 'primary' | 'outline' | 'text'
}

const defaultProps: Partial<ButtonProps> = {
  type: 'primary',
  size: 'default'
}

export function Button(props: ButtonProps) {
  const { className, children, size = 'primary', disabled, type, ...restProps } = { ...defaultProps, ...props }
  const { prefixCls } = use(ConfigContext)
  const btnPrefixCls = `${prefixCls}-btn`

  const rootCls = clsx(
    btnPrefixCls,
    `${btnPrefixCls}-size-${size}`,
    `${btnPrefixCls}-${type}`,
    { [`${btnPrefixCls}-disabled`]: disabled },
    className
  )

  return (
    <button {...restProps} className={rootCls} disabled={disabled}>
      {children}
    </button>
  )
}
