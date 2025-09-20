'use client'

import { useIntl } from '@/IntlContext'
import { useState } from 'react'

interface Props {
  dict
}

export default function Counter(props: Props) {
  // const { dict } = props

  const { dict } = useIntl()

  console.log(dict)

  const [count, setCount] = useState(0)

  return (
    <div>
      <div>{count > 5 ? dict.d5 : dict.sm5}</div>
      <button onClick={() => setCount(count - 1)}>{dict.minus}</button>
      <span className="m-4">{count}</span>
      <button onClick={() => setCount(count + 1)}>{dict.plus}</button>
    </div>
  )
}
