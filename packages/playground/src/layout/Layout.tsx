import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './layout.less'
import { componentsRoute } from '../routes'
import clsx from 'clsx'

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  const cc = location.pathname.replace(componentsRoute.path, '').slice(1)

  return (
    <div className="rt-layout">
      <header></header>

      <div className="main">
        <aside>
          <div style={{ height: 40 }}></div>
          {componentsRoute.children.map(item => (
            <div
              key={item.path}
              className={clsx('item', cc === item.path && 'active')}
              onClick={() => navigate(`${componentsRoute.path}/${item.path}`)}
            >
              {item.path}
            </div>
          ))}
        </aside>

        <section className="right">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

export default Layout
