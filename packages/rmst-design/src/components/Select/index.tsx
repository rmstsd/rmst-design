import { use } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import clsx from 'clsx'

import './style/style.less'
import { mergeProps, useInteract } from '../_util/hooks'
import { Trigger } from '../Trigger'
import { Empty } from '../Empty'

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

  const popup = (
    <div className={`${selectPrefixCls}-options-wrapper`}>
      {options.length === 0 && <Empty />}

      {options.map(item => (
        <div key={item.value} className={`${selectPrefixCls}-option-item`}>{item.label}</div>
      ))}
    </div>
  )

  return (
    <Trigger popup={popup} autoAlignPopupWidth>
      <div className={clsx(selectPrefixCls, interact.cls)}>
        <input onFocus={() => interact.setIsFocused(true)} />
      </div>
    </Trigger>
  )
}
