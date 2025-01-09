import clsx from 'clsx'
import { use, useRef } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import { useInteract } from '../_util/hooks'
import { IconWrapper } from '../IconWrapper'

import './style.less'
import CloseIcon from '../../icons/close'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, InteractProps {}

export function Input(props: InputProps) {
  const { className, size, readOnly, disabled, ...rest } = props

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
      interact.setIsFocused(false)
    }
  }

  const canInput = !(readOnly || disabled)

  return (
    <span
      className={wrapperCls}
      ref={interact.domRef}
      onClick={() => {
        interact.setIsFocused(true)
        inputRef.current?.focus()
      }}
    >
      <input
        {...rest}
        ref={inputRef}
        type="text"
        readOnly={readOnly}
        disabled={disabled}
        className={inputCls}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        onKeyDown={onKeyDownHandler}
        placeholder="placeholder"
      />

      {canInput && (
        <IconWrapper onClick={() => {}}>
          <CloseIcon />
        </IconWrapper>
      )}
    </span>
  )
}
