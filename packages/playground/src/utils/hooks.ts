import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useIsSSR } from 'rmst-design'

export function useSsrState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  const isSsr = useIsSSR()
  const [state, setState] = useState(initialState)

  useEffect(() => {
    setState(initialState)
  }, [isSsr])

  return [state, setState]
}

const useRefState = <T>(stateValue: T) => {
  const [_, update] = useState([])

  const ref = useRef(stateValue)
  const set = (fn: (state: T) => void) => {
    fn(ref.current)

    update([])
  }

  return [ref.current, set] as const
}
