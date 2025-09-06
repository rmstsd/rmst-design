import clsx from 'clsx'
import './style.less'
import { InteractProps } from '../_util/ConfigProvider'
import { useControllableValue } from '../_util/hooks'

export interface SwitchProps extends InteractProps {
  value?: boolean
  onChange?: (value: boolean) => void
}

export function Switch(props: SwitchProps) {
  const mergeProps = { ...props }
  const { value, disabled, readOnly, onChange } = mergeProps
  const size = mergeProps.size || 'middle'

  const [mergedValue, setMergedValue] = useControllableValue(props)

  const innerDisabled = disabled || readOnly

  function onClick() {
    setMergedValue?.(!mergedValue)
  }

  return (
    <button
      disabled={innerDisabled}
      className={clsx('rmst-switch', `size-m`, { disabled, readOnly, checked: mergedValue })}
      onClick={onClick}
    >
      <span className={clsx('switch-text')}>{mergedValue ? 'Y' : 'N'}</span>
      <div className={clsx('switch-dot')}></div>
    </button>
  )
}
