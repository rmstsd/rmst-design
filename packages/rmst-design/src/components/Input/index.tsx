import clsx from 'clsx'
import { ReactNode, use, useRef } from 'react'
import { X } from 'lucide-react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import { useControllableValue, useInteract } from '../_util/hooks'
import { IconWrapper } from '../IconWrapper'

import './style.less'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'>, InteractProps {
  value?: string
  onChange?: (value: string) => void

  after?: ReactNode
}

export function Input(props: InputProps) {
  const { className, size, readOnly, disabled, placeholder, after, ...rest } = props

  const [value, onChange] = useControllableValue({ ...props })

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
      <span className="input-content">
        <input
          {...rest}
          ref={inputRef}
          type="text"
          value={value ?? ''}
          readOnly={readOnly}
          disabled={disabled}
          className={inputCls}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          onKeyDown={onKeyDownHandler}
          onChange={evt => onChange?.(evt.target.value)}
          placeholder={placeholder}
        />

        {value && canInput ? (
          <IconWrapper className="clear" onClick={() => onChange('')} onPointerDown={evt => evt.preventDefault()}>
            <X />
          </IconWrapper>
        ) : null}
      </span>

      {after && (
        <span className="after" onPointerDown={evt => evt.preventDefault()}>
          {after}
        </span>
      )}
    </span>
  )
}
