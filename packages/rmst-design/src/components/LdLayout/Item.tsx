import clsx from 'clsx'
import { Fragment, PointerEvent, useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import { IConfig, ITabs } from './config'
import { observer } from 'mobx-react-lite'
import ldStore from './store'
import { startDrag } from '../_util/drag'
import { clamp } from 'es-toolkit'

interface ItemProps {
  config: IConfig
  parentConfig?: IConfig
}

export const Item = observer(({ config }: ItemProps) => {
  const { mode, children = [] } = config

  const containerRef = useRef<HTMLDivElement>(null)

  if (mode === 'tabs') {
    return <Tabs config={config as any} />
  }

  const onPointerDown = (downEvt: PointerEvent, childConfig: IConfig, index: number) => {
    downEvt.preventDefault()

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()

    const prev = children[index - 1]
    const next = children[index]

    let downSnap = {
      prev: prev.style.flexGrow,
      next: next.style.flexGrow
    }

    const min = 0.001
    const max = downSnap.next + downSnap.prev

    startDrag(downEvt, {
      onDragStart: () => {},
      onDragMove: moveEvt => {
        let distance = 0
        let size = 0

        if (mode === 'row') {
          distance = moveEvt.clientX - downEvt.clientX
          size = containerRect.width
        } else if (mode === 'column') {
          distance = moveEvt.clientY - downEvt.clientY
          size = containerRect.height
        }

        const delta = distance / size

        prev.style.flexGrow = clamp(downSnap.prev + delta, min, max)
        next.style.flexGrow = clamp(downSnap.next - delta, min, max)
      },
      onDragEnd: () => {}
    })
  }

  return (
    <div
      className={clsx('node-item', `${mode}-size-0`)}
      data-id={config.id}
      style={{ flexDirection: mode, flexGrow: config.style?.flexGrow }}
      ref={containerRef}
    >
      {children.map((childConfig, index) => (
        <Fragment key={index}>
          {index !== 0 && (
            <div
              className="node-item-divider"
              onPointerDown={evt => onPointerDown(evt, childConfig, index)}
              style={{ cursor: mode === 'row' ? 'ew-resize' : 'ns-resize' }}
            />
          )}
          <Item config={childConfig} />
        </Fragment>
      ))}
    </div>
  )
})

interface TabsProps {
  config: ITabs
}

const Tabs = observer(({ config }: TabsProps) => {
  const { children } = config

  if (!config.selected) {
    config.selected = children[0].id
  }

  const [overTabIndex, setOverTabIndex] = useState(-1)
  const tabContentRef = useRef<HTMLDivElement>(null)

  const onResize = useEffectEvent(() => {
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
    const observer = new ResizeObserver(() => {
      onResize()
    })

    observer.observe(tabContentRef.current)
    return () => observer.disconnect()
  }, [])

  const current = children.find(tab => tab.id === config.selected)

  if (!current) {
    return null
  }

  const onDragStart = (evt, source) => {
    ldStore.source = source

    evt.dataTransfer.effectAllowed = 'all'
    const img = new Image()
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E"
    evt.dataTransfer.setDragImage(img, 0, 0)
  }

  return (
    <div className="tabs" data-id={config.id} style={{ flexGrow: config.style?.flexGrow || 1 }}>
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

      <div className="tab-content" ref={tabContentRef}></div>
    </div>
  )
})
