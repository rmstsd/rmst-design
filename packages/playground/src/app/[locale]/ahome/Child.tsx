'use client'

import { startTransition, useEffect, useRef, useState, ViewTransition } from 'react'
import dynamic from 'next/dynamic'

import './child.scss'

function B() {
  return null
}

function A(props) {
  const [state, setState] = useState(0)

  // return <B></B>

  return props.children
}

export default function Child() {
  return (
    <div className="p-10">
      <A>
        <B />
      </A>
    </div>
  )
}
