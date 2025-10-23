import { configure, isObservable, makeAutoObservable, toJS } from 'mobx'
import { findParentNode, fixLayout, IComponent, IConfig } from './config'

import { genId, removeItem } from './config'
import { isClient } from '../_util/is'
import { cloneDeep } from 'es-toolkit'
import { DragEvent } from 'react'

configure({ enforceActions: 'never' })

if (isClient) {
  ;(window as any).__jf = () => ({ isObservable, toJS })
}

class LdStore {
  layout: IConfig = {
    mode: 'row',
    id: genId(),
    children: [
      {
        mode: 'tabs',
        id: genId(),
        children: [
          { id: '1', title: '1' },
          { id: '2', title: '2' }
        ]
      },
      {
        mode: 'column',
        id: genId(),
        children: [
          {
            mode: 'tabs',
            id: genId(),
            children: [
              { id: '3', title: '3' },
              { id: '4', title: '4' }
            ]
          },
          {
            mode: 'tabs',
            id: genId(),
            children: [
              { id: '5', title: '5' },
              { id: '6', title: '6' }
            ]
          }
        ]
      },
      {
        mode: 'tabs',
        id: genId(),
        children: [
          { id: '7', title: '7' },
          { id: '8', title: '8' }
        ]
      }
    ]
  }

  source // 一个 tab 项 或 tabs
  sourcePosition = { x: 0, y: 0 }

  constructor() {
    makeAutoObservable(this)
  }

  onDrag(evt: DragEvent) {
    this.sourcePosition = { x: evt.clientX, y: evt.clientY }
  }

  onDrop(overIndicator, target) {
    let { source } = this

    source = toJS(source)

    if (!source) {
      return
    }

    console.log('source', cloneDeep(source))
    console.log('target', cloneDeep(target))

    if (target.children.length === 1 && target.children.some(item => item.id === source.id)) {
      console.log('不能 ld 了')
      return
    }

    const sourceParent = findParentNode(source.id, this.layout)
    sourceParent.children = sourceParent.children.filter(item => item.id !== source.id)
    const p1 = findParentNode(sourceParent.id, this.layout)
    const p2 = findParentNode(target.id, this.layout)
    if (sourceParent.children.length === 0) {
      removeItem(sourceParent, this.layout)
    }

    const targetParent = findParentNode(target.id, this.layout)

    const index = targetParent.children.findIndex(item => item.id === target.id)

    if (index === -1) {
      console.log('意外等于 -1 了; 理论上不会出现')
      return
    }

    const isSameDirection =
      (overIndicator === 'right' && targetParent.mode === 'row') ||
      (overIndicator === 'left' && targetParent.mode === 'row') ||
      (overIndicator === 'bottom' && targetParent.mode === 'column') ||
      (overIndicator === 'top' && targetParent.mode === 'column')

    // 放置的方向 和 target 的 flex 布局方向 相同
    if (isSameDirection) {
      const config: IConfig = { id: genId(), mode: 'tabs', children: [source], style: {} }

      // 在一个容器内移动时, 不用处理 flexGrow
      // if (p1.id !== p2.id) {
      const average = target.style.flexGrow / 2
      target.style.flexGrow = average
      config.style.flexGrow = average
      // }

      if (overIndicator === 'right' || overIndicator === 'bottom') {
        targetParent.children.splice(index + 1, 0, config)
      }

      if (overIndicator === 'left' || overIndicator === 'top') {
        targetParent.children.splice(index, 0, config)
      }
    } else {
      // 需要再套一层
      const newMode = targetParent.mode === 'row' ? 'column' : 'row'
      let config: IConfig = { id: genId(), mode: newMode, children: [target], style: { flexGrow: target.style.flexGrow } }
      targetParent.children.splice(index, 1, config)

      // 获取 mobx 的代理对象, 而不能直接用 config
      config = targetParent.children[index]

      const tabConfig: IConfig = { id: genId(), mode: 'tabs', children: [source], style: {} }

      {
        // 需要再套一层的时候, 均分
        target.style.flexGrow = 0.5
        tabConfig.style.flexGrow = 0.5
      }

      if (overIndicator === 'right' || overIndicator === 'bottom') {
        config.children.splice(1, 0, tabConfig)
      }

      if (overIndicator === 'left' || overIndicator === 'top') {
        config.children.splice(0, 0, tabConfig)
      }
    }

    fixLayout(this.layout)
    this.layout = cloneDeep(this.layout)
    console.log('layout', toJS(this.layout))

    this.source = null
  }

  onTabItemDrop(targetConfig, index) {
    let { source } = this
    source = toJS(source)

    if (!source) {
      return
    }

    console.log('source', source)
    console.log('target', targetConfig)

    const sourceParent = findParentNode(source.id, this.layout)
    const originIndex = sourceParent.children.findIndex(item => item.id === source.id)

    // 在同一个数组内移动, 索引需要调整
    if (sourceParent.id === targetConfig.id) {
      if (index > originIndex) {
        index = index - 1
      }
    }

    targetConfig.children.splice(index, 0, ...[].concat(source.mode === 'tabs' ? source.children : [source]))

    sourceParent.children.splice(originIndex, 1)

    if (source.mode === 'tabs') {
      const average = source.style.flexGrow / sourceParent.children.length
      sourceParent.children.forEach(item => {
        item.style.flexGrow += average
      })
    }

    if (sourceParent.children.length === 0) {
      removeItem(sourceParent, this.layout)
    }

    console.log('layout', toJS(this.layout))

    fixLayout(this.layout)
    this.layout = cloneDeep(this.layout)

    this.source = null
  }
}

const ldStore = new LdStore()

export default ldStore
