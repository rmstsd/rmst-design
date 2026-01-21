import { observer } from 'mobx-react-lite'
import { createNode, oriData } from '../shared/oriData'
import { store } from './store'

function Aside() {
  return (
    <aside className="select-none border-r">
      {oriData.map(item => (
        <div
          key={item.id}
          {...{ 'data-source-id': item.id }}
          className="p-2 hover:bg-gray-100"
          onClick={() => {
            store.rootNode.children.push(createNode(item))
          }}
        >
          {item.id} {item.title}
        </div>
      ))}
    </aside>
  )
}

export default observer(Aside)
