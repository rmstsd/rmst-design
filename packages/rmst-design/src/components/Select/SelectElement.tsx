import { HTMLAttributes, Ref } from 'react'

interface SelectElementProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export default function SelectElement(props: SelectElementProps) {
  const { ref, onFocus, onKeyDown, onKeyUp, ...restProps } = props

  return (
    <div {...restProps} ref={ref}>
      <input onFocus={evt => onFocus?.(evt)} onKeyDown={onKeyDown} />
    </div>
  )
}
