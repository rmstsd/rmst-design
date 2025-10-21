import './style.less'
import { Item } from './Item'

import { observer } from 'mobx-react-lite'
import ldStore from './store'

export const LdLayout = observer(function LdLayout() {
  return (
    <div className="rt-ld-layout">
      <Item config={ldStore.layout} />
    </div>
  )
})
