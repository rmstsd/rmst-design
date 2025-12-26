import clsx from 'clsx'
import { Fragment, useLayoutEffect, useRef } from 'react'
import { TabsNode } from './config'
import { useLd } from './context'

interface TabsProps {
  config: TabsNode
}

export const Tabs = ({ config }: TabsProps) => {
  const { ldStore } = useLd()

  const tabContentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    config.children?.forEach(tab => {
      const isCache = ldStore.ContentEmMap.has(tab.id)
      if (!isCache) {
        const div = document.createElement('div')
        div.classList.add('portal-item')
        ldStore.ContentEmMap.set(tab.id, { div })
      }

      const cache = ldStore.ContentEmMap.get(tab.id)
      cache.reactElement = tab.content
    })

    const selectedCache = ldStore.ContentEmMap.get(config.selected)
    tabContentRef.current.appendChild(selectedCache.div)

    return () => {
      selectedCache.div?.remove()
    }
  }, [config.selected])

  return (
    <div className="tabs-node" data-id={config.id} style={{ flexGrow: config.style?.flexGrow }}>
      <div className="tab-header relative" data-tab-header-id={config.id}>
        <div className="tab-list-container">
          {config.children?.map((tab, index) => (
            <Fragment key={tab.id}>
              {index !== 0 && <div className="split-line"></div>}

              <div
                className={clsx('tab-item')}
                onClick={() => {
                  config.selected = tab.id
                  ldStore.onLayoutChange()
                }}
                data-tab-item-id={tab.id}
              >
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
}
