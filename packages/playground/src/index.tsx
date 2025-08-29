import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router'
import { IsSSRProvider } from 'rmst-design'

import './index.less'
import { StrictMode, useLayoutEffect, useRef, useState } from 'react'

const rootEl = document.getElementById('root')

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <>
      <BrowserRouter>
        <IsSSRProvider>
          <App />
        </IsSSRProvider>
      </BrowserRouter>
    </>
  )
}

// if (rootEl) {
//   const root = ReactDOM.createRoot(rootEl)
//   root.render(
//     <StrictMode>
//       <App2 />
//     </StrictMode>
//   )
// }

function App2() {
  const [visible, setVisible] = useState(false)
  return (
    <div className="p-96">
      <button onClick={() => setVisible(!visible)}>渲染子组件</button>

      <hr />

      {visible && <Child />}
    </div>
  )
}
const Child = () => {
  const [visible, setVisible] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const opt: any = { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
    if (visible) {
      ref.current.animate([{ height: '0px' }, { height: '200px' }], opt)
    } else {
      ref.current.animate([{ height: '200px' }, { height: '0px' }], opt)
    }
  }, [visible])

  // 关键修复：在组件卸载时重置firstRender，应对严格模式的双重渲染
  useLayoutEffect(() => {
    return () => {
      console.log('组件卸载')

      firstRender.current = true
    }
  }, [])

  return (
    <div>
      <button onClick={() => setVisible(!visible)}>显示/隐藏</button>

      <div ref={ref} className="bg-pink-200 overflow-hidden mt-10" style={{ height: 200 }}>
        哈哈哈
      </div>
    </div>
  )
}
