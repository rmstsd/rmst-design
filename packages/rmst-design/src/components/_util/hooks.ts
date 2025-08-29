import { RefObject, useMemo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { SetStateAction } from 'react'
import { on } from './dom'
import clsx from 'clsx'
import { InteractProps } from './ConfigProvider'
import { isFunction, isUndefined } from './is'
import { useIsSSR } from './ssr'

// 严格模式下有问题 无法解决
export function useIsFirstRender() {
  const renderRef = useRef(true)

  if (renderRef.current === true) {
    renderRef.current = false
    return true
  }

  return renderRef.current
}

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
  keyframesOut?: Keyframe[] | ((dom: HTMLElement) => Keyframe[])
}

const options: KeyframeAnimationOptions = {
  duration: 200,
  easing: 'ease'
}

export const useAnTransition = (config: Animate) => {
  const { appear = true, open, keyframes, keyframesOut } = config
  const isSSR = useIsSSR()

  const domRef = useRef<HTMLElement>(null)
  const firstMountRef = useRef(true)
  const [shouldMount, setShouldMount] = useState(open)

  if (open && open !== shouldMount) {
    setShouldMount(open)
  }

  useLayoutEffect(() => {
    return () => {
      firstMountRef.current = true
    }
  }, [])

  useLayoutEffect(() => {
    return
    if (isSSR) {
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
    const ani = domRef.current.animate(_kf, { ...options, fill: 'none' })
    ani.onfinish = () => {}
  }

  const close = (onfinish?: () => void) => {
    if (!domRef.current) {
      return
    }

    const outKfs = keyframesOut || keyframes
    const kfs = isFunction(outKfs) ? outKfs(domRef.current) : outKfs
    const _kfs = keyframesOut ? kfs : kfs.slice().reverse()
    const ani = domRef.current.animate(_kfs, { ...options, fill: 'forwards' })
    ani.onfinish = () => {
      onfinish?.()
    }
  }

  return { shouldMount, setDomRef }
}

export interface Options<T> {
  defaultValue?: T
  defaultValuePropName?: string
  valuePropName?: string
  trigger?: string
}

export type Props = Record<string, any>

export interface StandardProps<T> {
  value: T
  defaultValue?: T
  onChange: (val: T) => void
}

export function useControllableValue<T = any>(props: StandardProps<T>): [T, (v: SetStateAction<T>) => void]
export function useControllableValue<T = any>(
  props?: Props,
  options?: Options<T>
): [T, (v: SetStateAction<T>, ...args: any[]) => void]
export function useControllableValue<T = any>(defaultProps: Props, options: Options<T> = {}) {
  const props = defaultProps ?? {}

  const { defaultValue, defaultValuePropName = 'defaultValue', valuePropName = 'value', trigger = 'onChange' } = options

  const value = props[valuePropName] as T
  const isControlled = Object.prototype.hasOwnProperty.call(props, valuePropName)

  const initialValue = useMemo(() => {
    if (isControlled) {
      return value
    }
    if (Object.prototype.hasOwnProperty.call(props, defaultValuePropName)) {
      return props[defaultValuePropName]
    }
    return defaultValue
  }, [])

  const stateRef = useRef(initialValue)
  if (isControlled) {
    stateRef.current = value
  }

  const [_, update] = useState([])

  function setState(v: SetStateAction<T>, ...args: any[]) {
    const r = isFunction(v) ? v(stateRef.current) : v

    if (!isControlled) {
      stateRef.current = r
      update([])
    }
    if (props[trigger]) {
      props[trigger](r, ...args)
    }
  }

  return [stateRef.current, useEventCallback(setState)] as const
}
