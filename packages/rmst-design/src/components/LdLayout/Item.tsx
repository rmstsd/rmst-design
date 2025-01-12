import clsx from 'clsx'
import { useState } from 'react'
import { IConfig } from './config'
import { observer } from 'mobx-react-lite'
import ldStore from './store'

interface ItemProps {
  config: IConfig
  parentConfig?: IConfig
}

export const Item = observer(({ config }: ItemProps) => {
  if (config.type === 'row' || config.type === 'column') {
    return (
      <div className={clsx('node-item flex relative', config.type === 'column' && 'flex-column')} data-id={config.id}>
        {(config.children ?? []).map((childConfig, index) => (
          <Item config={childConfig} key={index} />
        ))}
      </div>
    )
  }

  if (config.type === 'tabset') {
    return <Tabs config={config} />
  }

  return null
})

interface TabsProps {
  config: IConfig
}

const Tabs = observer(({ config }: TabsProps) => {
  const [componentName, setComponentName] = useState(config.children[0].component)

  return (
    <div className="node-item tabset" data-id={config.id}>
      <div className="tab-header relative">
        {config.children?.map((childConfig, index) => (
          <div
            data-component-id={childConfig.component}
            className={clsx('tab-item', { 'tab-item-active': childConfig.component === componentName })}
            key={index}
            onClick={() => setComponentName(childConfig.component)}
          >
            {childConfig.component}

            <button
              onClick={() => ldStore.deleteTab(childConfig, index, config)}
              onPointerDown={evt => evt.stopPropagation()}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="outlet">{componentName}</div>
    </div>
  )
})
