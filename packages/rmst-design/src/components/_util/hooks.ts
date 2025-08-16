import { RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { on } from './dom'
import clsx from 'clsx'
import { InteractProps } from './ConfigProvider'
import { isFunction, isUndefined } from './is'
import { useIsSSR } from './ssr'

export function useEventCallback<Args extends unknown[], Return>(fn: (...args: Args) => Return): (...args: Args) => Return {
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

export function usePreviousRef<T>(state: T): RefObject<T> {
  const prevRef = useRef<T>(state)
  const curRef = useRef<T>(state)

  if (!Object.is(curRef.current, state)) {
    prevRef.current = curRef.current
    curRef.current = state
  }

  return prevRef
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
  const { appear = true, open, keyframes } = config
  const isSSR = useIsSSR()

  const domRef = useRef<HTMLElement>(null)
  const firstMountRef = useRef(true)
  const [shouldMount, setShouldMount] = useState(open)

  const prevOpenRef = usePreviousRef(open)

  if (open && open !== shouldMount) {
    setShouldMount(open)
  }

  useLayoutEffect(() => {
    if (isSSR) {
      return
    }

    // 兼容 严格模式 防止执行多次
    if (prevOpenRef.current === open) {
      return
    }

    const execTrans = () => {
      if (open) {
        show()
      } else {
        close(() => {
          setShouldMount(false)
        })
      }
    }

    if (firstMountRef.current) {
      firstMountRef.current = false

      if (appear) {
        execTrans()
      }
    } else {
      execTrans()
    }
  }, [open, isSSR])

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
