import axios from 'axios'
import { Suspense, use, useState } from 'react'

const api = ({ delay = 500, data = 'mockData' } = {}) => {
  return axios.post(`http://localhost:1400/test`, { delay, data }).then(res => res.data)
}

export default function AHome() {
  console.log(1)

  let [p, setP] = useState(() => api({ delay: 1000 }))

  return (
    <div>
      <button
        onClick={() => {
          setP(api({ delay: 500, data: '1' }))
        }}
      >
        setP 1秒
      </button>
      <button
        onClick={() => {
          setP(api({ delay: 2000, data: '2' }))
        }}
      >
        setP 2秒
      </button>

      <Suspense fallback={<div>loading</div>}>
        <Child p={p} />
      </Suspense>

      <Child2 p={p} />
    </div>
  )
}

const Child = props => {
  console.log('c')
  let data = use(props.p)
  console.log(data)

  return <div>{JSON.stringify(data)}</div>
}

const Child2 = props => {
  return <div>Child2</div>
}
