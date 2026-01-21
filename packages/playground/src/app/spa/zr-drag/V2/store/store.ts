import { configure, makeAutoObservable } from 'mobx'
import { createRootNode, type NodeItem } from '../../shared/oriData'
import { findParentNode, uuId } from '../../shared/utils'

import MoveHelper from './moveHelper'

configure({ enforceActions: 'never' })

enum Flow_Type {
  Main_Flow = 'Main_Flow',
  Sub_Flow = 'Sub-Flow'
}
interface IFlow {
  id: string
  title: string
  type: Flow_Type
  rootNode: NodeItem
}

class Store {
  constructor() {
    makeAutoObservable(this)

    setTimeout(() => {
      this.setActiveFlow(this.flowList[0])
    }, 0)
  }

  moveHelper = new MoveHelper()

  activeFlow: IFlow | null = null
  flowList: IFlow[] = [{ id: 'asdasd', title: '主流程', type: Flow_Type.Main_Flow, rootNode: createRootNode() }]

  addFlow() {
    const newFlow = {
      id: uuId(),
      title: `流程 ${this.flowList.length}`,
      type: Flow_Type.Sub_Flow,
      rootNode: createRootNode()
    }

    this.flowList.push(newFlow)
    this.setActiveFlow(this.flowList.at(-1))

    return newFlow
  }

  setActiveFlow(flow: IFlow) {
    store.activeFlow = flow
    this.moveHelper.rootNode = flow.rootNode
  }

  removeFlow(key) {
    this.flowList = this.flowList.filter(flow => flow.id !== key)
    this.setActiveFlow(this.flowList[0])
  }
}

export const store = new Store()
