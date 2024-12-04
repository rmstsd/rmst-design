import { use } from 'react'
import ConfigContext from '../_util/ConfigProvider'

import './style.less'

export function Empty() {
  const { prefixCls } = use(ConfigContext)

  return <div className={`${prefixCls}-empty`}>暂无数据</div>
}
