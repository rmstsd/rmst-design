'use client'

import { startTransition, useEffect, useRef, useState, ViewTransition } from 'react'
import { Button } from 'rmst-design'

import './child.scss'
import dynamic from 'next/dynamic'

// ✅ 告诉框架：这个组件只在客户端加载, 不要在服务端渲染
const Test = dynamic(() => import('@/components/Test'), {
  ssr: false,
  loading: () => <p>Loading Map...</p> // 可选：加载占位符
})

function B() {
  return null
}

function A(props) {
  return props.children
}

export default function Child() {
  const [show, setShow] = useState(false)
  const [state, setState] = useRefState([])

  return (
    <div className="p-10">
      <A>
        <B />
      </A>

      {/* <Test />

      <Button
        onClick={() => {
          setState(state => {
            state.push('a')
          })
        }}
      >
        click {state.toString()}
      </Button>
      {show && (
        <ViewTransition default="slow-fade">
          <div>Hi</div>
        </ViewTransition>
      )}
      <div>555</div> */}
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
