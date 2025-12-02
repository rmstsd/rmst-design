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

    children.forEach(tabItem => {
      ldStore.tabsSize.set(tabItem.id, {
        x: rect.x - rootLayoutRect.x,
        y: rect.y - rootLayoutRect.y,
        width: rect.width,
        height: rect.height
      })
    })
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

  const indicators = ['top', 'right', 'bottom', 'left']
  const [overIndicator, setOverIndicator] = useState('')

  const onDrop = overIndicator => {
    setOverIndicator('')
    ldStore.onLayoutDrop(overIndicator, config)
  }

  const onDragStart = (evt, source) => {
    ldStore.source = source

    evt.dataTransfer.effectAllowed = 'all'
    const img = new Image()
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E"
    evt.dataTransfer.setDragImage(img, 0, 0)
  }

  return (
    <div className="tabs" data-id={config.id} style={{ flexGrow: config.style?.flexGrow }}>
      <div className="tab-header relative">
        {config.children?.map((tab, index) => (
          <Fragment key={tab.id}>
            <div className={clsx('tab-item')} onClick={() => (config.selected = tab.id)}>
              {index === 0 && (
                <div
                  className={clsx('tab-item-indicator left', { over: overTabIndex === index })}
                  onDragOver={evt => evt.preventDefault()}
                  onDragEnter={() => setOverTabIndex(index)}
                  onDragLeave={() => setOverTabIndex(-1)}
                  onDrop={() => {
                    ldStore.onTabItemDrop(config, index)
                    setOverTabIndex(-1)
                  }}
                />
              )}
              <div
                className={clsx('tab-item-content', { selected: tab.id === config.selected })}
                draggable
                onDrag={evt => ldStore.onDrag(evt)}
                onDragEnd={() => (ldStore.source = null)}
                onDragExit={() => (ldStore.source = null)}
                onDragStart={evt => onDragStart(evt, tab)}
              >
                {tab.title}
              </div>

              <div
                className={clsx('tab-item-indicator', { over: overTabIndex === index + 1 })}
                onDragOver={evt => evt.preventDefault()}
                onDragEnter={() => setOverTabIndex(index + 1)}
                onDragLeave={() => setOverTabIndex(-1)}
                onDrop={() => {
                  ldStore.onTabItemDrop(config, index + 1)
                  setOverTabIndex(-1)
                }}
              />
            </div>
          </Fragment>
        ))}

        <div
          className="drag-handle"
          draggable
          onDrag={evt => ldStore.onDrag(evt)}
          onDragStart={evt => onDragStart(evt, config)}
          onDragEnd={() => (ldStore.source = null)}
          onDragExit={() => (ldStore.source = null)}
        ></div>
      </div>

      <div className="tab-content" ref={tabContentRef}>
        {config.selected}

        <div onDragOver={evt => evt.preventDefault()}>
          {indicators.map(item => (
            <div
              key={item}
              className={clsx(`indicator ${item}`, { over: overIndicator === item })}
              onDragEnter={() => setOverIndicator(item)}
              onDragLeave={() => setOverIndicator('')}
              onDrop={() => onDrop(item)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
})
