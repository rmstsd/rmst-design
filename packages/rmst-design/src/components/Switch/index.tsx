import clsx from 'clsx'
import './style.less'
import { InteractProps } from '../_util/ConfigProvider'
import { kfOptions, useControllableValue } from '../_util/hooks'
import { ReactNode, useLayoutEffect, useRef } from 'react'

export interface SwitchProps extends InteractProps {
  value?: boolean
  onChange?: (value: boolean) => void
  checkedText?: ReactNode
  unCheckedText?: ReactNode
}

export function Switch(props: SwitchProps) {
  const mergeProps = { ...props }
  const { value, disabled, readOnly, onChange, checkedText, unCheckedText } = mergeProps
  const size = mergeProps.size || 'default'

  const [mergedValue, setMergedValue] = useControllableValue(props)

  const innerDisabled = disabled || readOnly

  function onClick() {
    setMergedValue?.(!mergedValue)
  }

  const switchRef = useRef<HTMLButtonElement>(null)
  const prevRectRef = useRef<DOMRect>(null)
  const aniRef = useRef<Animation>(null)

  useLayoutEffect(() => {
    if (!prevRectRef.current) {
      prevRectRef.current = switchRef.current.getBoundingClientRect()
      return
    }

    aniRef.current?.cancel()

    const f = prevRectRef.current
    const l = switchRef.current.getBoundingClientRect()
    switchRef.current.style.whiteSpace = 'nowrap'
    aniRef.current = switchRef.current.animate([{ width: `${f.width}px` }, { width: `${l.width}px` }], kfOptions)

    aniRef.current.onfinish = () => {
      aniRef.current = null
      switchRef.current.style.whiteSpace = ''
    }

    prevRectRef.current = l
  }, [mergedValue])

  return (
    <button
      disabled={innerDisabled}
      ref={switchRef}
      className={clsx('rmst-switch', `rmst-switch-size-${size}`, { disabled, readOnly, checked: mergedValue })}
      onClick={onClick}
    >
      <span className={clsx('switch-text')}>{mergedValue ? checkedText ?? 'Y' : unCheckedText ?? 'N'}</span>
      <div className={clsx('switch-dot')}></div>
    </button>
  )
}
