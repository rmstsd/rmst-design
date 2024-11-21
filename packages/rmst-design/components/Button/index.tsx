import { forwardRef, PropsWithChildren } from 'react'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement>, PropsWithChildren {}

export function Button(props: ButtonProps) {
  const { children } = props

  return (
    <button className="rmst-button" {...props}>
      {children}
    </button>
  )
}
