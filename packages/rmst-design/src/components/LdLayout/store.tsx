import { configure, isObservable, makeAutoObservable, toJS } from 'mobx'
import {
  findParentNode,
  fixLayout,
  getComponentById,
  IComponent,
  IConfig,
  isPointInTriangle,
  Total_Grow,
  validateLayout
} from './config'

import { genId, removeItem } from './config'
import { isClient } from '../_util/is'
import { cloneDeep } from 'es-toolkit'
import { DragEvent, useEffect } from 'react'
import { startDrag } from '../_util/drag'

configure({ enforceActions: 'never' })

if (isClient) {
  ;(window as any).__jf = () => ({ isObservable, toJS })
}

export const ContentEm = props => {
  // useEffect(() => {
  //   console.log('useEffect', props.id)
  // }, [])

  return <div>{props.id} 的 content</div>
}

export const ContentEmMap = {
  '1': <ContentEm id="1" />,
  '2': <ContentEm id="2" />,
  '3': <ContentEm id="3" />,
  '4': <ContentEm id="4" />,
  '5': <ContentEm id="5" />,
  '6': <ContentEm id="6" />,
  '7': <ContentEm id="7" />,
  '8': <ContentEm id="8" />
}

class LdStore {
  layout: IConfig = {
    mode: 'row',
    id: genId(),
    isRoot: true,
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

  tabsSize = new Map()

  rootLayoutEl: HTMLDivElement

  source: IConfig // 一个 tab 项 或 tabs
  sourcePosition = { x: 0, y: 0 }

  overIndicatorRect: { left: number; top: number; width: number; height: number } = null

  constructor() {
    makeAutoObservable(this)
  }

  onPointerDown(downEvt: React.PointerEvent, tab) {
    let overIndicator
    let targetId

    startDrag(downEvt, {
      onDragStart: downEvt => {
        ldStore.source = tab
      },
      onDragMove: moveEvt => {
        ldStore.sourcePosition = { x: moveEvt.clientX, y: moveEvt.clientY }

        const target = moveEvt.target as HTMLElement
        const tabContentDom = target.closest(`[data-tab-content-id]`)

        if (!tabContentDom) {
          targetId = ''
          overIndicator = ''
          return
        }

        targetId = tabContentDom.getAttribute('data-tab-content-id')
        const rect = document.querySelector(`[data-id="${targetId}"]`)?.getBoundingClientRect()

        if (targetId === this.source.id) {
          this.overIndicatorRect = rect.toJSON()
          return
        }

        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }

        const list = [
          {
            indicator: 'top',
            a: { x: rect.left, y: rect.top },
            b: { x: rect.right, y: rect.top },
            c: { x: center.x, y: center.y },
            overIndicatorRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height / 2 }
          },
          {
            indicator: 'right',
            a: { x: rect.right, y: rect.top },
            b: { x: rect.right, y: rect.bottom },
            c: { x: center.x, y: center.y },
            overIndicatorRect: { left: center.x, top: rect.top, width: rect.width / 2, height: rect.height }
          },
          {
            indicator: 'bottom',
            a: { x: rect.left, y: rect.bottom },
            b: { x: rect.right, y: rect.bottom },
            c: { x: center.x, y: center.y },
            overIndicatorRect: { left: rect.left, top: center.y, width: rect.width, height: rect.height / 2 }
          },
          {
            indicator: 'left',
            a: { x: rect.left, y: rect.top },
            b: { x: rect.left, y: rect.bottom },
            c: { x: center.x, y: center.y },
            overIndicatorRect: { left: rect.left, top: rect.top, width: rect.width / 2, height: rect.height }
          }
        ]

        for (const item of list) {
          if (isPointInTriangle({ x: moveEvt.clientX, y: moveEvt.clientY }, item.a, item.b, item.c)) {
            overIndicator = item.indicator

            this.overIndicatorRect = item.overIndicatorRect
            break
          }
        }
      },
      onDragEnd: upEvt => {
        if (targetId && overIndicator) {
          const { config } = getComponentById(targetId, this.layout)
          this.onLayoutDrop(overIndicator, config)
        }

        ldStore.overIndicatorRect = null
        this.source = null
      }
    })
  }

  // 放在布局块时
  onLayoutDrop(overIndicator, target) {
    let { source } = this

    source = toJS(source)

    if (!source) {
      return
    }

    if (target.children.length === 1 && target.children.some(item => item.id === source.id)) {
      console.log('不能 ld 了')
      return
    }

    const sourceParent = findParentNode(source.id, this.layout)
    sourceParent.children = sourceParent.children.filter(item => item.id !== source.id)

    if (source.mode === 'tabs') {
      const average = source.style.flexGrow / sourceParent.children.length
      sourceParent.children.forEach(child => {
        child.style.flexGrow += average
      })
    }

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
      let newConfig
      if (source.mode === 'tabs') {
        newConfig = source
      } else {
        newConfig = { id: genId(), mode: 'tabs', children: [source], style: {} }
      }

      {
        const average = target.style.flexGrow / 2
        target.style.flexGrow = average
        newConfig.style.flexGrow = average
      }

      if (overIndicator === 'right' || overIndicator === 'bottom') {
        targetParent.children.splice(index + 1, 0, newConfig)
      }

      if (overIndicator === 'left' || overIndicator === 'top') {
        targetParent.children.splice(index, 0, newConfig)
      }
    } else {
      console.log('-- else')
      // 需要再套一层
      const newMode = targetParent.mode === 'row' ? 'column' : 'row'
      let config: IConfig = { id: genId(), mode: newMode, children: [target], style: { flexGrow: target.style.flexGrow } }
      targetParent.children.splice(index, 1, config)

      // 获取 mobx 的代理对象, 而不能直接用 config
      config = targetParent.children[index]

      let tabConfig
      if (source.mode === 'tabs') {
        tabConfig = source
      } else {
        tabConfig = { id: genId(), mode: 'tabs', children: [source], style: {} }
      }

      {
        // 需要再套一层的时候, 均分
        target.style.flexGrow = Total_Grow / 2
        tabConfig.style.flexGrow = Total_Grow / 2
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

    validateLayout(this.layout)

    this.source = null
  }

  // 放在 tab 项时
  onTabItemDrop(targetConfig, index) {
    let { source } = this
    source = toJS(source)

    if (!source) {
      return
    }

    const sourceParent = findParentNode(source.id, this.layout)
    const originIndex = sourceParent.children.findIndex(item => item.id === source.id)

    // 在同一个数组内移动, 索引需要调整
    if (sourceParent.id === targetConfig.id) {
      if (index > originIndex) {
        index = index - 1
      }
    }

    sourceParent.children.splice(originIndex, 1)
    targetConfig.children.splice(index, 0, ...[].concat(source.mode === 'tabs' ? source.children : [source]))

    if (source.mode === 'tabs') {
      const average = source.style.flexGrow / sourceParent.children.length
      sourceParent.children.forEach(item => {
        item.style.flexGrow += average
      })
    }

    if (sourceParent.children.length === 0) {
      removeItem(sourceParent, this.layout)
    }

    fixLayout(this.layout)
    this.layout = cloneDeep(this.layout)
    console.log('layout', toJS(this.layout))

    validateLayout(this.layout)

    this.source = null
  }
}

const ldStore = new LdStore()

export default ldStore

if (isClient) {
  window.ldStore = ldStore
}

declare global {
  interface Window {
    [k: string]: any
  }
}
