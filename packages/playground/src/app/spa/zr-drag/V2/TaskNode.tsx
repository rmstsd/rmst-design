import { observer } from 'mobx-react-lite'
import { store } from './store/store'
import type { NodeItem } from '../shared/oriData'
import { allowAppend, isRootNode } from './v2_utils'
import { DataNodeAttrName } from './store/moveHelper'
import { cn } from '@/utils/cn'
import { Button } from 'rmst-design'

interface TaskNodeProps {
  node: NodeItem
}

const TaskNode = observer(({ node }: TaskNodeProps) => {
  const { moveHelper } = store

  const isRoot = isRootNode(node)
  const isAllowAppend = allowAppend(node)

  return (
    <div
      {...{ [DataNodeAttrName]: node.id }}
      data-is-root={isRoot}
      className={cn(
        'task-node-item flow-root border border-gray-500',
        isRoot && 'mb-0 min-h-full border-red-400',
        moveHelper.isDragging && moveHelper.draggedNode === node && 'opacity-50'
      )}
    >
      {!isRoot && (
        <div className="node-title flex justify-between p-2">
          <div>
            {/* <Button data-drag={true} icon={<IconDragArrow />} type="default" size="mini" className="mr-4 cursor-move" /> */}
            {node.id}-{node.oriId}-{node.title}
          </div>

          <div>
            {isAllowAppend && (
              <>
                <span className="mr-4">childrenCount: {node.children.length}</span>
                <Button type="text" size="small" onClick={() => (node.expanded = !node.expanded)}>
                  {node.expanded ? '收起' : '展开'}
                </Button>
              </>
            )}

            <Button type="text" size="small" data-no-drag onClick={() => moveHelper.removeNode(node)}>
              删除
            </Button>
          </div>
        </div>
      )}

      {isAllowAppend && node.expanded && (
        <section className={cn('node-body mt-2', !isRoot && 'pl-2', isRoot && 'p-2')}>
          {node.children.map(item => (
            <TaskNode node={item} key={item.id} />
          ))}
        </section>
      )}
    </div>
  )
})

export default TaskNode
