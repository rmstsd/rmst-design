'use client'
import { useBoolean, useUpdate } from 'ahooks'
import { useLayoutEffect, useRef, useState } from 'react'

import Host from './components/Host'
import Portal from './components/Portal'
import { Button, Input } from 'rmst-design'

const MyPortalTest = () => {
  console.log('MyPortalTest render')
  const up = useUpdate()

  const [hostBool, act] = useBoolean(true)

  const [ppList, setPplist] = useState([
    { idx: 1, bool: true },
    { idx: 2, bool: true },
    { idx: 3, bool: true }
  ])

  const [multi, setMulti] = useState(true)

  const h1Ref = useRef(null)

  return (
    <>
      <h1 ref={h1Ref}>my</h1>
      <hr />

      <div onMouseDown={evt => evt.preventDefault()} className="border border-orange-400 p-3">
        <Button onClick={() => up()}>up</Button>

        <Button
          className="ml-3"
          onClick={() => {
            act.toggle()
          }}
        >
          hostBool {String(hostBool)}
        </Button>
        <hr />

        <>
          {ppList.map(item => (
            <Button
              key={item.idx}
              onClick={() => {
                item.bool = !item.bool
                setPplist([...ppList])
              }}
            >
              {item.idx} {String(item.bool)}
            </Button>
          ))}
        </>

        <Button onClick={() => setMulti(!multi)} className="ml-3">
          multi {String(multi)}
        </Button>
      </div>

      <hr />

      {hostBool && (
        <Host>
          <>PortalTest page in Host</>

          <hr />

          {ppList.map(item =>
            item.bool ? (
              <Portal key={item.idx}>
                <div className="my-2 border p-2">
                  {item.idx} portal内容 <Input />
                </div>
              </Portal>
            ) : null
          )}

          {multi && (
            <>
              <Portal>
                <div className="my-2 border p-2">
                  201 portal内容 multi
                  <Input />
                </div>
              </Portal>

              <Portal>
                <div className="my-2 border p-2">
                  202 portal内容 multi
                  <Input />
                </div>
              </Portal>

              <Portal>
                <div className="my-2 border p-2">
                  203 portal内容 multi
                  <Input />
                </div>
              </Portal>
            </>
          )}
        </Host>
      )}
    </>
  )
}

export default MyPortalTest

// <Child /> 为什么 props.cg() 打印结果是 null, 而不是 h4 dom元素? commit 与 useLayoutEffect 的执行时机
function Child() {
  const ref = useRef(null)

  const cg = () => {
    console.log(ref.current)
  }

  return (
    <>
      <h4 ref={ref}>h4</h4>
      <ChildSon cg={cg} />
      child
    </>
  )
}

function ChildSon(props) {
  useLayoutEffect(() => {
    props.cg()
  }, [])

  return null
}
