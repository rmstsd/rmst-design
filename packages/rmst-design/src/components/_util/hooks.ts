import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { on } from './dom'
import clsx from 'clsx'
import { InteractProps } from './ConfigProvider'
import { isFunction, isUndefined } from './is'

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

  const cls = clsx(componentCls, `${componentCls}-size-${size}`, {
    [`${componentCls}-focus`]: isFocused,
    [`${componentCls}-readonly`]: readOnly,
    [`${componentCls}-disabled`]: disabled
  })

  return { cls, isFocused, setIsFocused, domRef }
}

export const useMergeValue = <T>(defaultInnerValue: T, { propsValue }) => {
  const [value, setValue] = useState(() => {
    if (isUndefined(propsValue)) {
      return defaultInnerValue
    }

    return propsValue
  })

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

type Animate = {
  open: boolean
  appear?: boolean // 首次渲染时是否有动画
  keyframes?: Keyframe[] | ((dom: HTMLElement) => Keyframe[])
}

const options: KeyframeAnimationOptions = {
  duration: 200,
  easing: 'ease'
}

export const useAnTransition = (config: Animate) => {
  const { appear, open, keyframes } = config

  const domRef = useRef<HTMLElement>(null)
  const firstMountRef = useRef(true)
  const [shouldMount, setShouldMount] = useState(open)

  if (open && open !== shouldMount) {
    setShouldMount(open)
  }

  useLayoutEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false
      if (appear) {
        if (open) {
          show()
        } else {
          close(() => {
            setShouldMount(false)
          })
        }
      }
      return
    }

    if (open) {
      show()
    } else {
      close(() => {
        setShouldMount(false)
      })
    }
  }, [open])

  const setDomRef = (el: HTMLElement) => {
    domRef.current = el
  }

  const show = () => {
    if (!domRef.current) {
      return
    }
    const _kf = isFunction(keyframes) ? keyframes(domRef.current) : keyframes
    domRef.current.animate(_kf, { ...options, fill: 'none' })
  }

  const close = (onfinish?: () => void) => {
    if (!domRef.current) {
      return
    }
    const _kf = isFunction(keyframes) ? keyframes(domRef.current) : keyframes
    const ani = domRef.current.animate(_kf.slice().reverse(), { ...options, fill: 'forwards' })
    ani.onfinish = onfinish
  }

  return { shouldMount, setDomRef }
}
