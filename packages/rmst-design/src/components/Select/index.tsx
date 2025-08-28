import { RefObject, use, useRef, useState } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'

import { mergeProps, useInteract } from '../_util/hooks'
import { Trigger } from '../Trigger'
import { Empty } from '../Empty'
import { keyboardKey } from '../_util/keycode'
import getHotkeyHandler from '../_util/getHotkeyHandler'

import './style/style.less'

type OptionItem = { value: string | number; label: string | number }
interface SelectProps extends InteractProps {
  options?: OptionItem[]
  placeholder?: string
}

const defaultProps: SelectProps = {
  options: []
}

export function Select(props: SelectProps) {
  props = mergeProps(defaultProps, props)
  const { size, readOnly, disabled, options, placeholder } = props
  const { prefixCls, size: ctxSize } = use(ConfigContext)

  const merSize = size ?? ctxSize

  const selectPrefixCls = `${prefixCls}-select`

  const interact = useInteract(selectPrefixCls, { size: merSize, readOnly, disabled })
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const keepFocus = (evt: React.PointerEvent<HTMLDivElement>) => {
    evt.preventDefault()
  }

  const hide = () => {
    setVisible(false)
    interact.setIsFocused(false)
    inputRef.current.blur()
  }

  const onKeyDown = getHotkeyHandler(
    new Map([
      [
        keyboardKey.Esc,
        () => {
          hide()
        }
      ],
      [
        keyboardKey.Tab,
        () => {
          hide()
        }
      ],
      [keyboardKey.ArrowUp, evt => {}],
      [keyboardKey.ArrowDown, evt => {}]
    ])
  )

  const popup = (
    <div className={`${selectPrefixCls}-options-wrapper`} onPointerDown={keepFocus}>
      {options.length === 0 && <Empty />}
      {options.map(item => (
        <div key={item.value} className={`${selectPrefixCls}-option-item`}>
          {item.label}
        </div>
      ))}
    </div>
  )

  return (
    <Trigger
      popup={popup}
      autoAlignPopupWidth
      trigger="focus"
      visible={visible}
      disabled={readOnly}
      onChange={visible => {
        setVisible(visible)
        if (visible === false) {
          interact.setIsFocused(false)
        }
      }}
    >
      <div
        className={interact.cls}
        onPointerDown={evt => {
          evt.preventDefault()
          inputRef.current.focus()
        }}
        tabIndex={disabled ? undefined : -1}
        onKeyDown={onKeyDown}
        onFocus={() => {
          interact.setIsFocused(true)
        }}
        onBlur={() => {
          if (readOnly) {
            interact.setIsFocused(false)
          }
        }}
      >
        <input ref={inputRef} disabled={disabled} readOnly={readOnly} placeholder={placeholder} value="" onChange={() => {}} />
      </div>
    </Trigger>
  )
}
