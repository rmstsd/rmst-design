import clsx from 'clsx'
import { Fragment, useEffect, useEffectEvent, useRef, useState } from 'react'
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

  const [overTabIndex, setOverTabIndex] = useState(-1)
  const tabContentRef = useRef<HTMLDivElement>(null)

  const onResize = useEffectEvent(() => {
    if (!ldStore.rootLayoutEl || !tabContentRef.current) {
      return
    }
    const rootLayoutRect = ldStore.rootLayoutEl.getBoundingClientRect()
    const rect = tabContentRef.current.getBoundingClientRect()

    // children.forEach(tabItem => {
    //   ldStore.tabsSize.set(tabItem.id, {
    //     x: rect.x - rootLayoutRect.x,
    //     y: rect.y - rootLayoutRect.y,
    //     width: rect.width,
    //     height: rect.height
    //   })
    // })
  })

  useEffect(() => {
    onResize()
  }, [config.selected])

  useEffect(() => {
    if (!tabContentRef.current) {
      return
    }
    const observer = new ResizeObserver(() => {
      onResize()
    })

    observer.observe(tabContentRef.current)
    return () => observer.disconnect()
  }, [tabContentRef.current])

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
        {config.selected}
      </div>
    </div>
  )
})
