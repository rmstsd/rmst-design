import clsx from 'clsx'
import { Fragment, PointerEvent, useLayoutEffect, useRef, useState } from 'react'
import { IConfig, ITabs } from './config'
import { observer } from 'mobx-react-lite'
import ldStore from './store'
import { startDrag } from '../_util/drag'

interface ItemProps {
  config: IConfig
  parentConfig?: IConfig
}

export const Item = observer(({ config }: ItemProps) => {
  const { mode, children = [] } = config

  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    config.children.forEach(item => {
      item.style = { flexGrow: 1 / config.children.length }
    })
  }, [])

  if (mode === 'tabs') {
    return <Tabs config={config as any} />
  }

  const onPointerDown = (downEvt: PointerEvent, childConfig: IConfig, index: number) => {
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()

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

        const prev = children[index - 1]
        const next = children[index]

        if (distance < 0) {
          prev.style.flexGrow += delta
          next.style.flexGrow -= delta
        } else {
          prev.style.flexGrow -= delta
          next.style.flexGrow += delta
        }

        console.log(prev.style.flexGrow)
      },
      onDragEnd: () => {}
    })
  }

  return (
    <div
      className={clsx('node-item ')}
      data-id={config.id}
      style={{ flexDirection: mode, flexGrow: config.style?.flexGrow || 1 }}
      ref={containerRef}
    >
      {children.map((childConfig, index) => (
        <Fragment key={index}>
          {index !== 0 && <div className="node-item-divider" onPointerDown={evt => onPointerDown(evt, childConfig, index)} />}
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
  const { children: tabs } = config
  const [selected, setSelected] = useState(tabs[0].id)

  const [overIndicator, setOverIndicator] = useState('')
  const [overTabIndex, setOverTabIndex] = useState(-1)

  const onDrop = overIndicator => {
    console.log(overIndicator)
    setOverIndicator('')

    ldStore.onDrop(overIndicator, config)
  }

  const current = tabs.find(tab => tab.id === selected)

  if (!current) {
    setSelected(tabs[0].id)
  }

  if (!current) {
    return null
  }

  return (
    <div className="tabs" data-id={config.id} style={{ flexGrow: config.style?.flexGrow || 1 }}>
      <div className="tab-header relative">
        {config.children?.map((tab, index) => (
          <Fragment key={tab.id}>
            <div className={clsx('tab-item')} onClick={() => setSelected(tab.id)}>
              {index === 0 && (
                <div
                  className={clsx('tab-item-indicator left', { over: overTabIndex === index })}
                  onDragOver={evt => evt.preventDefault()}
                  onDragEnter={() => {
                    setOverTabIndex(index)
                  }}
                  onDragLeave={() => {
                    setOverTabIndex(-1)
                  }}
                  onDrop={() => {
                    ldStore.onTabItemDrop(config, index)
                    setOverTabIndex(-1)
                  }}
                />
              )}
              <div
                className={clsx('tab-item-content', { selected: tab.id === selected })}
                draggable
                onDrag={evt => ldStore.onDrag(evt)}
                onDragEnd={() => (ldStore.source = null)}
                onDragExit={() => (ldStore.source = null)}
                onDragStart={evt => {
                  ldStore.source = tab

                  evt.dataTransfer.effectAllowed = 'all'

                  const img = new Image()
                  img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E"
                  evt.dataTransfer.setDragImage(img, 0, 0)
                }}
              >
                {tab.title}
              </div>

              <div
                className={clsx('tab-item-indicator', { over: overTabIndex === index + 1 })}
                onDragOver={evt => evt.preventDefault()}
                onDragEnter={() => {
                  setOverTabIndex(index + 1)
                }}
                onDragLeave={() => {
                  setOverTabIndex(-1)
                }}
                onDrop={() => {
                  ldStore.onTabItemDrop(config, index + 1)
                  setOverTabIndex(-1)
                }}
              />
            </div>
          </Fragment>
        ))}
      </div>

      <div
        className="tab-content"
        onDragOver={evt => evt.preventDefault()}
        onDragEnter={() => {
          console.log('onDragEnter', config)
        }}
      >
        {current.title}

        <div
          className={clsx('indicator top', { over: overIndicator === 'top' })}
          onDragEnter={() => setOverIndicator('top')}
          onDragLeave={() => setOverIndicator('')}
          onDrop={() => onDrop('top')}
        ></div>
        <div
          className={clsx('indicator right', { over: overIndicator === 'right' })}
          onDragEnter={() => setOverIndicator('right')}
          onDragLeave={() => setOverIndicator('')}
          onDrop={() => onDrop('right')}
        ></div>
        <div
          className={clsx('indicator bottom', { over: overIndicator === 'bottom' })}
          onDragEnter={() => setOverIndicator('bottom')}
          onDragLeave={() => setOverIndicator('')}
          onDrop={() => onDrop('bottom')}
        ></div>
        <div
          className={clsx('indicator left', { over: overIndicator === 'left' })}
          onDragEnter={() => setOverIndicator('left')}
          onDragLeave={() => setOverIndicator('')}
          onDrop={() => onDrop('left')}
        ></div>
      </div>
    </div>
  )
})
