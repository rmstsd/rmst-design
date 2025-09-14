import clsx from 'clsx'
import { InteractProps } from '../_util/ConfigProvider'
import { kfOptions, useControllableValue, useInteract } from '../_util/hooks'
import { ReactNode, useLayoutEffect, useRef } from 'react'

import './style.less'

export interface SwitchProps extends InteractProps {
  value?: boolean
  onChange?: (value: boolean) => void
  checkedText?: ReactNode
  unCheckedText?: ReactNode
}

export function Switch(props: SwitchProps) {
  const mergeProps = { ...props }
  const { disabled, readOnly, checkedText, unCheckedText } = mergeProps

  const [mergedValue, setMergedValue] = useControllableValue(props)
  const interact = useInteract('rmst-switch', { size: mergeProps.size || 'default', readOnly, disabled })

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

  function onClick() {
    if (interact.isDisabledOrReadonly) {
      return
    }
    setMergedValue?.(!mergedValue)
  }

  return (
    <button disabled={disabled} ref={switchRef} className={clsx(interact.cls, { checked: mergedValue })} onClick={onClick}>
      <span className={clsx('switch-text')}>{mergedValue ? checkedText ?? 'Y' : unCheckedText ?? 'N'}</span>
      <div className={clsx('switch-dot')}></div>
    </button>
  )
}
