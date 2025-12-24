'use client'

import { startTransition, useEffect, useRef, useState, ViewTransition } from 'react'
import { Button } from 'rmst-design'

import './child.scss'

export default function Child() {
  const [show, setShow] = useState(false)

  const [state, setState] = useRefState([])

  useEffect(() => {
    setInterval(() => {
      console.log(state)
    }, 1000)
  }, [])

  return (
    <div className="p-10">
      <Button
        onClick={() => {
          setState(state => {
            state.push('a')
          })
          // startTransition(() => {
          //   setShow(!show)
          // })
        }}
      >
        click {state.toString()}
      </Button>
      {show && (
        <ViewTransition default="slow-fade">
          <div>Hi</div>
        </ViewTransition>
      )}
      <div>555</div>
    </div>
  )
}

const useRefState = <T,>(stateValue: T) => {
  const [_, update] = useState([])

  const ref = useRef(stateValue)
  const set = (fn: (state: T) => void) => {
    fn(ref.current)

    update([])
  }

  return [ref.current, set] as const
}
