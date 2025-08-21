import axios from 'axios'
import { Suspense, use, useState } from 'react'

const api = ({ delay = 0 } = {}): Promise<{ data: any }> => {
  return axios
    .get(`https://jsonplaceholder.typicode.com/todos`, {
      params: { _delay: delay }
    })
    .then(res => res.data.slice(0, 3))
}

export default function AHome() {
  const [input, setInput] = useState('')

  let [p, setP] = useState(() => {
    return [api(), api()]
  })

  return (
    <div>
      <button
        onClick={() => {
          setP([api({ delay: 500 }), api({ delay: 800 })])
        }}
      >
        set P
      </button>

      <input
        type="text"
        value={input}
        onChange={evt => {
          const val = evt.target.value
          setInput(val)

          console.log(p)
          // p.forEach(item => {
          //   item?.cancel()
          // })
        }}
      />

      <Suspense fallback={<div className="bg-pink-100 p-2">loading </div>}>
        <Child p={p[0]} />
        <Child2 p={p[1]} />
      </Suspense>

      {/* {p.map((item, index) => (
        
      ))} */}
    </div>
  )
}

const Child = props => {
  const { p } = props

  if (!p) {
    return null
  }

  let data = use(p)

  return (
    <ul className="border bg-purple-50">
      {data.map(item => (
        <li key={item.title}>{item.title}</li>
      ))}
    </ul>
  )
}

const Child2 = ({ p }) => {
  return (
    <Suspense fallback={<div className="bg-pink-100 p-2">loading Child2</div>}>
      <Child3 p={p} />
    </Suspense>
  )
}

const Child3 = ({ p }) => {
  let data = use(p)

  return (
    <ul className="border bg-purple-50">
      {data.map(item => (
        <li key={item.title}>{item.title}</li>
      ))}
    </ul>
  )
}
