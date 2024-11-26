import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './layout.less'
import { componentsConfig, componentsRoute } from '../routes'
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

          {componentsConfig.map(gItem => {
            return (
              <div key={gItem.group}>
                <div className="group-title p-10 text-gray-500 f-size-14">{gItem.group}</div>

                {gItem.components.map(item => (
                  <div
                    key={item.path}
                    className={clsx('item hover:bg-gray-200', cc === item.path && 'active')}
                    onClick={() => navigate(`${componentsRoute.path}/${item.path}`)}
                  >
                    {item.path}
                  </div>
                ))}
              </div>
            )
          })}
        </aside>

        <section className="right">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

export default Layout
