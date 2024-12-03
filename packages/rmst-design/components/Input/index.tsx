import clsx from 'clsx'
import './style.less'
import { use } from 'react'
import ConfigContext from '../_util/ConfigProvider'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  const { className, ...rest } = props

  const { prefixCls, size: ctxSize } = use(ConfigContext)

  return <input className={clsx(`${prefixCls}-input`, className)} {...rest}></input>
}
