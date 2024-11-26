import { forwardRef, PropsWithChildren, RefObject } from 'react'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  ref?: RefObject<HTMLButtonElement>
}

export function Button(props: ButtonProps) {
  const { children } = props

  return (
    <button className="rmst-button" {...props}>
      {children}
    </button>
  )
}
