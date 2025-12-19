import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useIsSSR } from 'rmst-design'

export function useSsrState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  const isSsr = useIsSSR()
  const [state, setState] = useState(initialState)

  useEffect(() => {
    setState(initialState)
  }, [isSsr])

  return [state, setState]
}
