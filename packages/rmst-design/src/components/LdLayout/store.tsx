import {
  findParentNode,
  fixLayout,
  findNodeById,
  IConfig,
  isPointInTriangle,
  Total_Grow,
  validateLayout,
  source2TabList,
  genId,
  removeItem,
  Over,
  overTabHeight,
  rootCollisionSize,
  LayoutNode,
  TabsNode,
  traverse,
  isLayoutNode
} from './config'

import { cloneDeep, noop } from 'es-toolkit'
import React from 'react'
import { startDrag } from '../_util/drag'
import { getDefaultLayout } from './testData'

export class LdStore {
  layout: IConfig = getDefaultLayout()

  onLayoutChange = noop
  setLayout(layout: IConfig) {
    this.layout = layout
  }

  tabsSize = new Map()

  ContentEmMap = new Map<string, { reactElement?; div?: HTMLDivElement }>()

  ContentEmMapSet(id, k: 'reactElement' | 'div', v) {
    if (!this.ContentEmMap.has(id)) {
      this.ContentEmMap.set(id, {})
    }

    this.ContentEmMap.get(id)[k] = v
  }

  rootLayoutEl: HTMLDivElement

  source: IConfig // 一个 tab 项 或 tabs
  sourcePosition = { x: 0, y: 0 }

  over: Over

  constructor() {}

  clearTouch() {
    this.over = null
  }

  onPointerDown(downEvt: React.PointerEvent, tab) {
    startDrag(downEvt, {
      onDragStart: downEvt => {
        this.source = tab
      },
      onDragMove: moveEvt => {
        this.sourcePosition = { x: moveEvt.clientX, y: moveEvt.clientY }

        const target = document.elementFromPoint(moveEvt.clientX, moveEvt.clientY) as HTMLElement
        if (!target) {
          this.clearTouch()
          this.onLayoutChange()
          return
        }

        const findClosestNode = () => {
          const rootElement = document.querySelector(`[data-is-root]`)
          const tabHeaderDom = target.closest(`[data-tab-header-id]`)
          const tabContentDom = target.closest(`[data-tab-content-id]`)

          const isOverTabItem = Boolean(tabHeaderDom)
          const isOverTabContent = Boolean(tabContentDom)

          const rootRect = rootElement?.getBoundingClientRect()
          const one_of_four_width = rootRect.width / 4
          const one_of_four_height = rootRect.height / 4

          const rootIndicators = [
            {
              indicator: 'top',
              rect: {
                x1: rootRect.left,
                y1: rootRect.top,
                x2: rootRect.right,
                y2: rootRect.top + rootCollisionSize
              },
              overIndicatorRect: {
                left: rootRect.left,
                top: rootRect.top,
                width: rootRect.width,
                height: one_of_four_height
              }
            },
            {
              indicator: 'right',
              rect: {
                x1: rootRect.right - rootCollisionSize,
                y1: rootRect.top,
                x2: rootRect.right,
                y2: rootRect.bottom
              },
              overIndicatorRect: {
                left: rootRect.right - one_of_four_width,
                top: rootRect.top,
                width: one_of_four_width,
                height: rootRect.height
              }
            },
            {
              indicator: 'bottom',
              rect: {
                x1: rootRect.left,
                y1: rootRect.bottom - rootCollisionSize,
                x2: rootRect.right,
                y2: rootRect.bottom
              },
              overIndicatorRect: {
                left: rootRect.left,
                top: rootRect.bottom - one_of_four_height,
                width: rootRect.width,
                height: one_of_four_height
              }
            },
            {
              indicator: 'left',
              rect: {
                x1: rootRect.left,
                y1: rootRect.top,
                x2: rootRect.left + rootCollisionSize,
                y2: rootRect.bottom
              },
              overIndicatorRect: {
                left: rootRect.left,
                top: rootRect.top,
                width: one_of_four_width,
                height: rootRect.height
              }
            }
          ] as const

          let isOverRoot = false
          for (const item of rootIndicators) {
            if (
              moveEvt.clientX >= item.rect.x1 &&
              moveEvt.clientX <= item.rect.x2 &&
              moveEvt.clientY >= item.rect.y1 &&
              moveEvt.clientY <= item.rect.y2
            ) {
              isOverRoot = true
              this.over = { type: 'root', indicator: item.indicator, indicatorRect: item.overIndicatorRect }
              break
            }
          }

          if (isOverRoot) {
            return
          }

          if (isOverTabItem) {
            this.over = { type: 'tabItem', indicator: null, indicatorRect: new DOMRect() }

            const tabHeaderId = tabHeaderDom.getAttribute('data-tab-header-id')
            const tabsNode = findNodeById(tabHeaderId, this.layout)

            let min = Infinity
            let closestNode: TabsNode
            let closestRect: DOMRect
            tabsNode.config.children.forEach(item => {
              const rect = document.querySelector(`[data-tab-item-id="${item.id}"]`)?.getBoundingClientRect()

              let distance = Math.min(Math.abs(moveEvt.clientX - rect.left), Math.abs(moveEvt.clientX - rect.right))
              if (distance < min) {
                min = distance
                closestNode = item as TabsNode
                closestRect = rect
              }
            })

            const parentNode = findParentNode(closestNode.id, this.layout)

            if (
              this.source.mode === 'tabs' &&
              (parentNode.id === this.source.id || parentNode.children.some(item => item.id === this.source.id))
            ) {
              this.over.indicatorRect = document.querySelector(`[data-id="${this.source.id}"]`).getBoundingClientRect().toJSON()
              return
            }

            this.over.node = parentNode
            const index = parentNode.children.findIndex(item => item.id === closestNode.id)

            const isAfter = Math.abs(moveEvt.clientX - closestRect.left) > Math.abs(moveEvt.clientX - closestRect.right)
            this.over.tabIndex = isAfter ? index + 1 : index

            const boundaryOffset = 2
            let x
            if (isAfter) {
              const nextNode = parentNode.children[index + 1]
              if (nextNode) {
                const nextRect = document.querySelector(`[data-tab-item-id="${nextNode.id}"]`)?.getBoundingClientRect()
                x = (closestRect.right + nextRect.left) / 2
              } else {
                x = closestRect.right + boundaryOffset
              }
            } else {
              const prevNode = parentNode.children[index - 1]
              if (prevNode) {
                const prevRect = document.querySelector(`[data-tab-item-id="${prevNode.id}"]`)?.getBoundingClientRect()
                x = (closestRect.left + prevRect.right) / 2
              } else {
                x = closestRect.left - boundaryOffset
              }
            }
            let top = closestRect.top + (closestRect.height - overTabHeight) / 2
            this.over.indicatorRect = { left: x - 1, top, width: 2, height: overTabHeight }
          } else if (isOverTabContent) {
            this.over = { type: 'tabContent', indicator: null, indicatorRect: new DOMRect() }

            this.over.targetId = tabContentDom.getAttribute('data-tab-content-id')
            const rect = document.querySelector(`[data-id="${this.over.targetId}"]`)?.getBoundingClientRect()

            if (this.over.targetId === this.source.id) {
              this.over.indicatorRect = rect.toJSON()
              return
            }

            const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            const one_of_third_width = rect.width / 4
            const one_of_third_height = rect.height / 4

            const list = [
              {
                indicator: 'center',
                rect: {
                  x1: rect.left + one_of_third_width,
                  y1: rect.top + one_of_third_height,
                  x2: rect.right - one_of_third_width,
                  y2: rect.bottom - one_of_third_height
                },
                overIndicatorRect: rect.toJSON()
              },
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
            ] as const

            for (const item of list) {
              if (item.indicator === 'center') {
                if (
                  moveEvt.clientX >= item.rect.x1 &&
                  moveEvt.clientX <= item.rect.x2 &&
                  moveEvt.clientY >= item.rect.y1 &&
                  moveEvt.clientY <= item.rect.y2
                ) {
                  this.over.indicator = item.indicator
                  this.over.indicatorRect = item.overIndicatorRect
                  break
                }
                continue
              }

              if (isPointInTriangle({ x: moveEvt.clientX, y: moveEvt.clientY }, item.a, item.b, item.c)) {
                this.over.indicator = item.indicator
                this.over.indicatorRect = item.overIndicatorRect
                break
              }
            }
          }
        }

        findClosestNode()

        this.onLayoutChange()
      },
      onDragEnd: ({ isCanceled }) => {
        const { source, over } = this
        const _cancel = isCanceled || !source || !over
        if (!_cancel) {
          switch (over.type) {
            case 'root': {
              this.onLayoutRootDrop()
              break
            }
            case 'tabItem': {
              this.onTabItemDrop()
              break
            }
            case 'tabContent': {
              this.onLayoutDrop()
              break
            }
          }
        }

        this.clearTouch()
        this.source = null

        this.onLayoutChange()
      }
    })
  }

  // RootDrop
  onLayoutRootDrop() {
    const rootNode = this.layout
    const source = this.source
    const { indicator: overIndicator } = this.over

    removeItem(source, rootNode)

    const isSameDirection =
      (overIndicator === 'right' && rootNode.mode === 'row') ||
      (overIndicator === 'left' && rootNode.mode === 'row') ||
      (overIndicator === 'bottom' && rootNode.mode === 'column') ||
      (overIndicator === 'top' && rootNode.mode === 'column')

    let newConfig
    if (source.mode === 'tabs') {
      newConfig = source
    } else {
      newConfig = { id: genId(), mode: 'tabs', children: [source], style: {} }
    }

    newConfig.style.flexGrow = 20

    if (isSameDirection) {
      const average = newConfig.style.flexGrow / rootNode.children.length
      rootNode.children.forEach(item => {
        item.style.flexGrow -= average
      })

      if (overIndicator === 'right' || overIndicator === 'bottom') {
        rootNode.children.push(newConfig)
      } else {
        rootNode.children.unshift(newConfig)
      }
    } else {
      const newMode = rootNode.mode === 'row' ? 'column' : 'row'
      let config: IConfig = {
        id: genId(),
        mode: newMode,
        isRoot: true,
        children: [{ ...rootNode, isRoot: false, style: { flexGrow: 80 } } as LayoutNode]
      }

      if (overIndicator === 'right' || overIndicator === 'bottom') {
        config.children.push(newConfig)
      } else {
        config.children.unshift(newConfig)
      }

      this.layout = cloneDeep(config)
    }

    fixLayout(this.layout)

    validateLayout(this.layout)
  }

  // 放在布局块时
  onLayoutDrop() {
    let { source, over } = this
    const { indicator: overIndicator } = over

    const { config: target } = findNodeById(over.targetId, this.layout)

    if (source.id === target.id) {
      return
    }

    if (target.children.length === 1 && target.children.some(item => item.id === source.id)) {
      return
    }

    removeItem(source, this.layout)

    const targetParent = findParentNode(target.id, this.layout)
    const index = targetParent.children.findIndex(item => item.id === target.id)

    if (index === -1) {
      console.log('意外等于 -1 了; 理论上不会出现')
      return
    }

    if (overIndicator === 'center') {
      target.children.push(...source2TabList(source))
    } else {
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
    }

    fixLayout(this.layout)
    this.layout = cloneDeep(this.layout)

    validateLayout(this.layout)

    this.source = null
  }

  // 放在 tab 项时
  onTabItemDrop() {
    let { source, over } = this

    if (!over.node) {
      return
    }

    const sourceParent = findParentNode(source.id, this.layout)
    const originIndex = sourceParent.children.findIndex(item => item.id === source.id)

    let index = over.tabIndex
    // 在同一个数组内移动
    if (sourceParent.id === over.node.id) {
      // 提前判断如果移动后位置不变, 则不移动 (避免 removeItem 内部逻辑导致最终数据出错)
      if (over.tabIndex === originIndex || over.tabIndex === originIndex + 1) {
        return
      }

      // 索引需要调整
      if (index > originIndex) {
        index = index - 1
      }
    }

    removeItem(source, this.layout)
    over.node.children.splice(index, 0, ...source2TabList(source))

    fixLayout(this.layout)
    this.layout = cloneDeep(this.layout)

    validateLayout(this.layout)

    this.source = null
  }

  nAverage() {
    // 初始化 n 等分
    traverse(this.layout, item => {
      if (isLayoutNode(item)) {
        if (item.isRoot) {
          item.style ??= { flexGrow: Total_Grow }
        }
      }

      if (isLayoutNode(item)) {
        item.children?.forEach(child => {
          child.style ??= {
            flexGrow: Total_Grow / item.children.length
          }
        })
      } else if (item.mode === 'tabs') {
        const _item = item as TabsNode
        if (!_item.selected) {
          _item.selected = _item.children[0]?.id
        }
      }
    })
  }
}
