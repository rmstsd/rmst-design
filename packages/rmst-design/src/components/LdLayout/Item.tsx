import clsx from 'clsx'
import { useState } from 'react'
import { IConfig } from './config'

interface ItemProps {
  config: IConfig
  parentConfig?: IConfig
}

export const Item = ({ config }: ItemProps) => {
  if (config.type === 'row' || config.type === 'column') {
    return (
      <div className={clsx('node-item flex', config.type === 'column' && 'flex-column')} data-id={config.id}>
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
}

const Tabs = ({ config }) => {
  const [componentName, setComponentName] = useState(config.children[0].component)

  return (
    <div className="node-item tabset" data-id={config.id}>
      <div className="tab-header">
        {config.children?.map((childConfig, index) => (
          <div
            data-component-id={childConfig.component}
            className={clsx('tab-item', { 'tab-item-active': childConfig.component === componentName })}
            key={index}
            onClick={() => setComponentName(childConfig.component)}
          >
            {childConfig.component}
          </div>
        ))}
      </div>

      <div className="outlet">{componentName}</div>
    </div>
  )
}
