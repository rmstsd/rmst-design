import { use, useState } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import clsx from 'clsx'

import './style/style.less'
import { mergeProps, useInteract } from '../_util/hooks'
import { Trigger } from '../Trigger'
import { Empty } from '../Empty'
import { keyboardKey } from '../_util/keycode'
import getHotkeyHandler from '../_util/getHotkeyHandler'

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
    </div>
  )

  const onKeyDown = getHotkeyHandler(
    new Map([
      [
        keyboardKey.Esc,
        evt => {
          console.log('esc')
        }
      ],
      [
        keyboardKey.Tab,
        evt => {
          console.log('tab')

          setVisible(false)
          interact.setIsFocused(false)
        }
      ],
      [
        keyboardKey.ArrowUp,
        evt => {
          console.log('arrow up')
        }
      ],
      [
        keyboardKey.ArrowDown,
        evt => {
          console.log('arrow down')
        }
      ]
    ])
  )

  const [visible, setVisible] = useState(false)

  return (
    <Trigger
      popup={popup}
      autoAlignPopupWidth
      visible={visible}
      onChange={visible => {
        console.log(visible)
        setVisible(visible)

        if (visible === false) {
          interact.setIsFocused(false)
        }
      }}
    >
      <div className={clsx(selectPrefixCls, interact.cls)} tabIndex={0}>
        <input
          onFocus={() => {
            interact.setIsFocused(true)
            setVisible(true)
          }}
          onKeyDown={onKeyDown}
        />
      </div>
    </Trigger>
  )
}
