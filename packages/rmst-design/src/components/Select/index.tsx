import { RefObject, use, useRef, useState } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import clsx from 'clsx'

import './style/style.less'
import { mergeProps, useInteract } from '../_util/hooks'
import { Trigger } from '../Trigger'
import { Empty } from '../Empty'
import { keyboardKey } from '../_util/keycode'
import getHotkeyHandler from '../_util/getHotkeyHandler'
import SelectElement from './SelectElement'

type OptionItem = { value: string | number; label: string | number }
interface SelectProps extends InteractProps {
  options?: OptionItem[]
}

const defaultProps: SelectProps = {
  options: []
}

export function Select(props: SelectProps) {
  props = mergeProps(defaultProps, props)
  const { size, readOnly, disabled, options } = props
  const { prefixCls, size: ctxSize } = use(ConfigContext)

  const merSize = size ?? ctxSize

  const selectPrefixCls = `${prefixCls}-select`

  const interact = useInteract(selectPrefixCls, { size: merSize, readOnly, disabled })
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const keepFocus = (evt: React.PointerEvent<HTMLDivElement>) => {
    evt.preventDefault()
  }

  const popup = (
    <div>
      <div className={`${selectPrefixCls}-options-wrapper`} onPointerDown={keepFocus}>
        {options.length === 0 && <Empty />}
        {options.map(item => (
          <div key={item.value} className={`${selectPrefixCls}-option-item`}>
            {item.label}
          </div>
        ))}
      </div>

      <input type="text" />
    </div>
  )

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

  return (
    <Trigger
      popup={popup}
      autoAlignPopupWidth
      trigger="focus"
      visible={visible}
      onChange={visible => {
        console.log(visible)

        setVisible(visible)

        if (visible === false) {
          interact.setIsFocused(false)
        }
      }}
    >
      <SelectElement
        className={clsx(selectPrefixCls, interact.cls)}
        onKeyDown={onKeyDown}
        onClick={() => {
          console.log('root click')
          inputRef.current.focus()
        }}
      />
      {/* <div
        onPointerDown={keepFocus}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onFocus={() => {
          console.log('focus')
          interact.setIsFocused(true)
          setVisible(true)
        }}
      >
        <input ref={inputRef} />
      </div> */}
    </Trigger>
  )
}
