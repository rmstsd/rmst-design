import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router'
import { IsSSRProvider } from 'rmst-design'

import './index.less'
import { StrictMode } from 'react'

const rootEl = document.getElementById('root')

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <StrictMode>
      <BrowserRouter>
        <IsSSRProvider>
          <App />
        </IsSSRProvider>
      </BrowserRouter>
    </StrictMode>
  )
}
