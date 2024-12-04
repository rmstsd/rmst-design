import { use } from 'react'
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

  return (
    <Trigger popup={popup} autoAlignPopupWidth>
      <div className={clsx(selectPrefixCls, interact.cls)}>
        <input onFocus={() => interact.setIsFocused(true)} onKeyDown={onKeyDown} />
      </div>
    </Trigger>
  )
}
