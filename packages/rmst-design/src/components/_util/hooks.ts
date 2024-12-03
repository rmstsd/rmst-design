import { useCallback, useEffect, useRef, useState } from 'react'
import { on } from './dom'

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

export const useInteract = () => {
  const [isFocused, setIsFocused] = useState(false)
  const domRef = useRef<HTMLElement>(null)

  useClickOutside(() => {
    setIsFocused(false)
  }, domRef)

  return { isFocused, setIsFocused, domRef }
}
