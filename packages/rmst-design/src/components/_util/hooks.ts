import { useCallback, useEffect, useRef, useState } from 'react'
import { on } from './dom'
import clsx from 'clsx'
import { InteractProps } from './ConfigProvider'

export function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const ref = useRef<typeof fn | undefined>(undefined)
  ref.current = fn

  return useCallback((...args: Args) => ref.current.apply(void 0, args), [])
}

export const useClickOutside = (cb: () => void, domRef: React.RefObject<HTMLElement>) => {
  const ecb = useEventCallback(cb)

  useEffect(() => {
    const abort = on(document.body, 'pointerdown', evt => {
      if (domRef.current && domRef.current.contains(evt.target as Node)) {
        return
      }

      ecb()
    })

    return () => {
      abort()
    }
  }, [domRef.current])
}

export const useInteract = (componentCls: string, props: InteractProps) => {
  const { size, readOnly, disabled } = props

  const [isFocused, setIsFocused] = useState(false)
  const domRef = useRef<HTMLElement>(null)

  // useClickOutside(() => {
  //   setIsFocused(false)
  // }, domRef)

  const cls = clsx(componentCls, `${componentCls}-size-${size}`, {
    [`${componentCls}-focus`]: isFocused,
    [`${componentCls}-readonly`]: readOnly,
    [`${componentCls}-disabled`]: disabled
  })

  return { cls, isFocused, setIsFocused, domRef }
}

export const useMergeValue = propsValue => {
  const [value, setValue] = useState(propsValue)

  // undefined 认为是非受控
  if (propsValue !== undefined && propsValue !== value) {
    setValue(propsValue)
  }

  return [value, setValue]
}

export const mergeProps = <T>(defaultProps: T, componentProps: T) => {
  return { ...defaultProps, ...componentProps }
}

export function usePrevious<T>(state: T): T | undefined {
  const prevRef = useRef<T>(undefined)
  const curRef = useRef<T>(undefined)

  if (!Object.is(curRef.current, state)) {
    prevRef.current = curRef.current
    curRef.current = state
  }

  return prevRef.current
}
