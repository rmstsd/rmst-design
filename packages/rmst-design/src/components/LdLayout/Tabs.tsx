import clsx from 'clsx'
import { Fragment, useEffect, useRef } from 'react'
import { ITabs } from './config'
import { observer } from 'mobx-react-lite'
import ldStore from './store'

interface TabsProps {
  config: ITabs
}

export const Tabs = observer(({ config }: TabsProps) => {
  const { children } = config

  if (!config.selected) {
    config.selected = children[0].id
  }

  const tabContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    tabContentRef.current.innerHTML = ''
    const em = ldStore.ContentEmMap.get(config.selected)
    tabContentRef.current.appendChild(em.div)
  }, [config.selected])

  return (
    <div className="tabs" data-id={config.id} style={{ flexGrow: config.style?.flexGrow }}>
      <div className="tab-header relative" data-tab-header-id={config.id}>
        <div className="tab-list-container">
          {config.children?.map((tab, index) => (
            <Fragment key={tab.id}>
              {index !== 0 && <div className="split-line"></div>}

              <div className={clsx('tab-item ')} onClick={() => (config.selected = tab.id)} data-tab-item-id={tab.id}>
                <div
                  className={clsx('tab-item-content', { selected: tab.id === config.selected })}
                  onPointerDown={evt => ldStore.onPointerDown(evt, tab)}
                  onDragStart={evt => evt.preventDefault()}
                >
                  {tab.title}
                </div>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="drag-handle" onPointerDown={evt => ldStore.onPointerDown(evt, config)}></div>
      </div>

      <div className="tab-content" data-tab-content-id={config.id} ref={tabContentRef}>
        {/* {config.selected} */}
      </div>
    </div>
  )
})
