import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { isRootNode, store } from './store'
import type { NodeItem } from '../shared/oriData'
import { cn } from '@/utils/cn'
import { Button } from 'rmst-design'

interface TaskNodeProps {
  parentNode?: NodeItem
  node: NodeItem
}

const TaskNode = observer(({ parentNode, node }: TaskNodeProps) => {
  const isRoot = isRootNode(node)

  useEffect(() => {
    document.onpointerup = () => {
      store.clear()
    }
  }, [])

  return (
    <div className={cn('task-node-item flow-root', isRoot && 'root-node')}>
      {!isRoot && (
        <div
          id="insert-before"
          className={cn('min-h-[10px]', store.insertBeforeNode?.id === node.id && 'bg-purple-500')}
          onPointerUp={() => store.onDropInsertBefore()}
          onPointerEnter={() => {
            if (!store.draggedNode) {
              return
            }
            store.insertBeforeNode = node
            store.insertedParentNode = parentNode
          }}
          onPointerLeave={() => {
            store.insertBeforeNode = null
            store.insertedParentNode = null
          }}
        ></div>
      )}

      <div
        className="drag-node rounded-md border border-gray-500 p-6"
        onPointerDown={evt => store.startDrag(evt, node, parentNode)}
      >
        {!isRoot && (
          <div className="node-title flex justify-between">
            <div>
              {node.id}-{node.oriId}-{node.title}
            </div>

            <Button type="text" size="small" onClick={() => store.removeNode(node, parentNode)}>
              删除
            </Button>
          </div>
        )}

        {(isRoot || node.type === 'if') && (
          <section className={cn('node-body', !isRoot && 'pl-20')}>
            {node.children.map(item => (
              <TaskNode parentNode={node} node={item} key={item.id} />
            ))}

            <div
              id="append-after"
              className={cn('min-h-[10px]', store.appendAfterNode?.id === node.id && 'bg-pink-400')}
              onPointerUp={() => store.onDropAppendAfter()}
              onPointerEnter={() => {
                if (store.draggedNode) {
                  store.appendAfterNode = node
                }
              }}
              onPointerLeave={() => {
                store.appendAfterNode = null
              }}
            ></div>
          </section>
        )}
      </div>
    </div>
  )
})

export default TaskNode
