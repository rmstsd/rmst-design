import { observer } from 'mobx-react-lite'
import { store } from './store/store'

function Ghost() {
  const { moveHelper } = store
  if (!moveHelper.draggedNode) {
    return null
  }

  return (
    <div className="pointer-events-none">
      {moveHelper.isDragging && (
        <>
          <div className="indicator fixed" style={{ ...moveHelper.indicatorStyle }}></div>
          <div
            className="fixed left-0 top-0 border bg-white p-4 shadow-lg"
            style={{ transform: `translate(${moveHelper.point.x}px, ${moveHelper.point.y}px)` }}
          >
            {moveHelper.draggedNode.title}
          </div>
        </>
      )}
    </div>
  )
}

export default observer(Ghost)
