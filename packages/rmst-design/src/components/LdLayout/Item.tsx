import clsx from 'clsx'
import { useState } from 'react'
import { IConfig } from './config'

interface ItemProps {
  config: IConfig
  parentConfig?: IConfig
  useColumn?: boolean
}

export const Item = ({ config, useColumn }: ItemProps) => {
  if (config.type === 'row') {
    return (
      <div className={clsx('flex', useColumn && 'flex-column')}>
        {(config.children ?? []).map((childConfig, index) => (
          <Item config={childConfig} key={index} useColumn={!useColumn} />
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
    <div className="tabset">
      <div className="tab-header">
        {config.children?.map((childConfig, index) => (
          <div
            data-component={childConfig.component}
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
