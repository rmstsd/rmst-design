import { observer } from 'mobx-react-lite'
import { oriData } from '../../shared/oriData'
import { DataSourceAttrName } from '../store/moveHelper'

function Aside() {
  return (
    <aside className="flex-shrink-0 select-none border-r" style={{ width: 180 }}>
      {oriData.map(item => (
        <div key={item.id} {...{ [DataSourceAttrName]: item.id }} className="touch-none p-2 hover:bg-gray-100">
          {item.id} - {item.title}
        </div>
      ))}
    </aside>
  )
}

export default observer(Aside)
