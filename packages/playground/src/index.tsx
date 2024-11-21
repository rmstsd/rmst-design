import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'

import './index.less'

const rootEl = document.getElementById('root')

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </HashRouter>
  )
}
