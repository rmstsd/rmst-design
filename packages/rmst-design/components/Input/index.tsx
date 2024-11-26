import clsx from 'clsx'
import './style.less'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  const { className, ...rest } = props

  return <input className={clsx('rt-input', className)} {...rest}></input>
}

