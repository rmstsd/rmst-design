import clsx from 'clsx'
import { use, useRef } from 'react'
import { X } from 'lucide-react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import { useInteract } from '../_util/hooks'
import { IconWrapper } from '../IconWrapper'

import './style.less'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'>, InteractProps {
  value?: string
  onChange?: (value: string) => void
}

export function Input(props: InputProps) {
  const { className, size, readOnly, disabled, value, onChange, placeholder, ...rest } = props

  const { prefixCls, size: ctxSize } = use(ConfigContext)

  const merSize = size ?? ctxSize

  const inputPrefixCls = `${prefixCls}-input`

  const interact = useInteract(inputPrefixCls, {})
  const inputRef = useRef<HTMLInputElement>(null)

  const onFocusChange = (isFocus: boolean) => {
    if (isFocus) {
      interact.setIsFocused(true)
    } else {
      interact.setIsFocused(false)
    }
  }

  const wrapperCls = clsx(`${prefixCls}-input-wrapper`, {
    [`${prefixCls}-input-wrapper-focus`]: interact.isFocused,
    [`${prefixCls}-input-wrapper-readonly`]: readOnly,
    [`${prefixCls}-input-wrapper-disabled`]: disabled
  })
  const inputCls = clsx(inputPrefixCls, `${inputPrefixCls}-size-${merSize}`)

  const onKeyDownHandler = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Tab') {
      // interact.setIsFocused(false)
    }
  }

  const canInput = !(readOnly || disabled)

  return (
    <span
      className={wrapperCls}
      ref={interact.domRef}
      onClick={() => {
        if (disabled) {
          return
        }

        interact.setIsFocused(true)
        inputRef.current?.focus()
      }}
    >
      <input
        {...rest}
        ref={inputRef}
        type="text"
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        className={inputCls}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        onKeyDown={onKeyDownHandler}
        onChange={evt => onChange?.(evt.target.value)}
        placeholder={placeholder}
      />

      {canInput && (
        <IconWrapper className="clear" onClick={() => onChange('')} onPointerDown={evt => evt.preventDefault()}>
          <X />
        </IconWrapper>
      )}
    </span>
  )
}
