import clsx from 'clsx'
import { useState } from 'react'
import { IConfig, ITabs } from './config'
import { observer } from 'mobx-react-lite'
import ldStore from './store'

interface ItemProps {
  config: IConfig
  parentConfig?: IConfig
}

export const Item = observer(({ config }: ItemProps) => {
  const { mode, children = [] } = config

  if (mode === 'tabs') {
    return <Tabs config={config as any} />
  }

  return (
    <div className={clsx('node-item ')} data-id={config.id} style={{ flexDirection: mode }}>
      {children.map((childConfig, index) => (
        <Item config={childConfig} key={index} />
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
    <div className="tabs" data-id={config.id}>
      <div className="tab-header relative" draggable>
        {config.children?.map((tab, index) => (
          <div
            data-component-id={tab}
            className={clsx('tab-item', { selected: tab.id === selected })}
            key={index}
            onClick={() => setSelected(tab.id)}
            draggable
            onDragStart={() => {
              ldStore.source = tab
            }}
          >
            {tab.title}
          </div>
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
