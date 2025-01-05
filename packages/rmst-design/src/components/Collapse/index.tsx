import { use, useState } from 'react'
import ConfigContext from '../_util/ConfigProvider'

import './style.less'
import CollapseItem, { Item } from './CollapseItem'

interface CollapseProps {
  items: Item[]
  defaultActiveKey?: Item['onlyKey'][]
  accordion?: boolean
}

export function Collapse(props: CollapseProps) {
  const { items, defaultActiveKey, accordion } = props

  const { prefixCls } = use(ConfigContext)

  const [activeKey, setActiveKey] = useState(defaultActiveKey ?? [])

  const updateKey = (key: string) => {
    if (accordion) {
      if (activeKey.includes(key)) {
        setActiveKey([])
      } else {
        setActiveKey([key])
      }
    } else {
      setActiveKey(activeKey.includes(key) ? activeKey.filter(k => k !== key) : [...activeKey, key])
    }
  }

  return (
    <div className={`${prefixCls}-collapse`}>
      {items.map(item => (
        <CollapseItem key={item.onlyKey} item={item} activeKey={activeKey} updateKey={updateKey} />
      ))}
    </div>
  )
}
