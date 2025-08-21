import axios from 'axios'
import { Suspense, use, useState } from 'react'
import { sleep } from '../../utils'

const api = ({ delay = 500, name = 'mockData' } = {}): Promise<{ data: any }> => {
  return axios.post(`http://localhost:1400/test`, { delay, name }).then(res => res.data)
}

const count = 3
const url = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`

const getUserList = async ({ delay = 500 } = {}): Promise<{ data: any }> => {
  const abct = new AbortController()

  await sleep(delay)

  const p = axios.get(url, { signal: abct.signal }).then(res => res.data.results)

  p.cancel = () => {
    abct.abort()
  }

  return p
}

const oo = getUserList()

console.log(oo)

export default function AHome() {
  const [input, setInput] = useState('')

  let [p, setP] = useState(() => {
    return [api()]
  })

  return (
    <div>
      <button
        onClick={() => {
          setP([api({ delay: 1000 }), api({ delay: 2000 })])
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

          setP([getUserList()])
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
        <li key={item.name}>{item.name}</li>
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
        <li key={item.name}>{item.name}</li>
      ))}
    </ul>
  )
}
