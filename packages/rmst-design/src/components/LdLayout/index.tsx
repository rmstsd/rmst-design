import './style.less'
import { Item } from './Item'

import { observer } from 'mobx-react-lite'
import ldStore from './store'

export const LdLayout = observer(function LdLayout() {
  return (
    <div className="rt-ld-layout" onPointerDown={ldStore.onPointerDown}>
      <Item config={ldStore.pageConfig} />

      {ldStore.dropTarget && <div className="ghost" style={{ ...ldStore.dropRect }}></div>}
      {ldStore.dragTarget && (
        <div className="dragTarget" style={{ left: ldStore.dragCoord.x - 25, top: ldStore.dragCoord.y - 15 }}>
          {ldStore.dragTarget.config.component}
        </div>
      )}
    </div>
  )
})
