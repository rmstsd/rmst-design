import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router'

import './index.less'

const rootEl = document.getElementById('root')

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
