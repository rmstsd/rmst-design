import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router'
import { IsSSRProvider } from 'rmst-design'

import './index.less'

const rootEl = document.getElementById('root')

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <BrowserRouter>
      <IsSSRProvider>
        <App />
      </IsSSRProvider>
    </BrowserRouter>
  )
}
