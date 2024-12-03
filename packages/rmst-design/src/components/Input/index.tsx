import clsx from 'clsx'
import './style.less'
import { HTMLAttributes, PropsWithChildren, use } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import { useInteract } from '../_util/hooks'
import CloseIcon from '../../icons/close'
import { IconWrapper } from '../IconWrapper'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, InteractProps {}

export function Input(props: InputProps) {
  const { className, size, readOnly, disabled, ...rest } = props

  const { prefixCls, size: ctxSize } = use(ConfigContext)

  const merSize = size ?? ctxSize

  const inputPrefixCls = `${prefixCls}-input`

  const interact = useInteract()

  const onFocusChange = (isFocus: boolean) => {
    if (isFocus) {
      interact.setIsFocused(true)
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

  return (
    <span className={wrapperCls} ref={interact.domRef} onClick={() => interact.setIsFocused(true)}>
      <input
        {...rest}
        type="text"
        readOnly={readOnly}
        disabled={disabled}
        className={inputCls}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        onKeyDown={onKeyDownHandler}
      />

      <IconWrapper></IconWrapper>
    </span>
  )
}
