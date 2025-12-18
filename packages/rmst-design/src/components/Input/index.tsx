import { ReactNode, use, useRef } from 'react'
import { X } from 'lucide-react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import { useControllableValue, useInteract } from '../_util/hooks'
import { IconWrapper } from '../IconWrapper'

import './style.less'
import { mergeRefs } from 'react-merge-refs'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'>, InteractProps {
  value?: string
  onChange?: (value: string) => void

  after?: ReactNode
  ref?: React.Ref<HTMLInputElement>
}

export function Input(props: InputProps) {
  const { className, size, readOnly, disabled, placeholder, after, ref, ...rest } = props

  const [value, onChange] = useControllableValue({ ...props })

  const { prefixCls, size: ctxSize } = use(ConfigContext)

  const merSize = size ?? ctxSize

  const inputPrefixCls = `${prefixCls}-input`

  const interact = useInteract(inputPrefixCls, { size: merSize, readOnly, disabled })
  const inputRef = useRef<HTMLInputElement>(null)

  const onFocusChange = (isFocus: boolean) => {
    if (isFocus) {
      interact.setIsFocused(true)
    } else {
      interact.setIsFocused(false)
    }
  }

  return (
    <div
      className={interact.cls}
      ref={mergeRefs([interact.domRef, ref])}
      tabIndex={disabled ? undefined : -1}
      onFocus={() => {
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
          className="rmst-native-input"
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          onChange={evt => onChange?.(evt.target.value)}
          placeholder={placeholder}
        />

        {value && !interact.isDisabledOrReadonly ? (
          <IconWrapper className="clear" onClick={() => onChange('')} onPointerDown={evt => evt.preventDefault()}>
            <X />
          </IconWrapper>
        ) : null}
      </span>

      {after && <span className="after">{after}</span>}
    </div>
  )
}
