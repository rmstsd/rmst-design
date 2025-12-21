import { configure, isObservable, makeAutoObservable, toJS } from 'mobx'
import {
  findParentNode,
  fixLayout,
  findNodeById,
  IConfig,
  isPointInTriangle,
  Total_Grow,
  validateLayout,
  ITabs,
  source2TabList,
  genId,
  removeItem,
  Over
} from './config'

import { isClient } from '../_util/is'
import { cloneDeep } from 'es-toolkit'
import React from 'react'
import { startDrag } from '../_util/drag'
import { getDefaultLayout } from './testData'

configure({ enforceActions: 'never' })

if (isClient) {
  ;(window as any).__jf = () => ({ isObservable, toJS })
}

class LdStore {
  layout: IConfig = getDefaultLayout()

  tabsSize = new Map()

  rootLayoutEl: HTMLDivElement

  source: IConfig // 一个 tab 项 或 tabs
  sourcePosition = { x: 0, y: 0 }

  over: Over

  targetId // todo： 合并 over 与 target 的语义

  constructor() {
    makeAutoObservable(this)
  }

  clearTouch() {
    this.over = null
    this.targetId = null
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
          return
        }

        const findClosestNode = () => {
          const rootElement = document.querySelector(`[data-is-root]`)
          const tabHeaderDom = target.closest(`[data-tab-header-id]`)
          const tabContentDom = target.closest(`[data-tab-content-id]`)

          const isOver = Boolean(tabHeaderDom) || Boolean(tabContentDom)
          if (!isOver) {
            return
          }

          const rootRect = rootElement?.getBoundingClientRect()

          const one_of_four_width = rootRect.width / 4
          const one_of_four_height = rootRect.height / 4

          const collisionSize = 8
          const rootIndicators = [
            {
              indicator: 'top',
              rect: {
                x1: rootRect.left,
                y1: rootRect.top,
                x2: rootRect.right,
                y2: rootRect.top + collisionSize
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
                x1: rootRect.right - collisionSize,
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
                y1: rootRect.bottom - collisionSize,
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
                x2: rootRect.left + collisionSize,
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
              this.over = { overType: 'root', overIndicator: item.indicator, overIndicatorRect: item.overIndicatorRect }
              break
            }
          }

          if (isOverRoot) {
            return
          }

          const isOverTabItem = Boolean(tabHeaderDom)
          if (isOverTabItem) {
            this.over = { overType: 'tabItem', overIndicator: null, overIndicatorRect: new DOMRect() }

            const tabHeaderId = tabHeaderDom.getAttribute('data-tab-header-id')
            const tabsNode = findNodeById(tabHeaderId, this.layout)

            let min = Infinity
            let closestNode: ITabs
            let closestRect: DOMRect
            tabsNode.config.children.forEach(item => {
              const rect = document.querySelector(`[data-tab-item-id="${item.id}"]`)?.getBoundingClientRect()

              let distance = Math.min(Math.abs(moveEvt.clientX - rect.left), Math.abs(moveEvt.clientX - rect.right))
              if (distance < min) {
                min = distance
                closestNode = item as ITabs
                closestRect = rect
              }
            })

            const parentNode = findParentNode(closestNode.id, this.layout)

            if (
              this.source.mode === 'tabs' &&
              (parentNode.id === this.source.id || parentNode.children.some(item => item.id === this.source.id))
            ) {
              this.over.overIndicatorRect = document
                .querySelector(`[data-id="${this.source.id}"]`)
                .getBoundingClientRect()
                .toJSON()
              return
            }

            this.over.overTabNode = parentNode
            const index = parentNode.children.findIndex(item => item.id === closestNode.id)

            const isAfter = Math.abs(moveEvt.clientX - closestRect.left) > Math.abs(moveEvt.clientX - closestRect.right)
            this.over.overTabIndex = isAfter ? index + 1 : index

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

            const height = 14
            let top = closestRect.top + (closestRect.height - height) / 2
            this.over.overIndicatorRect = { left: x - 1, top, width: 2, height }
          } else {
            this.over = { overType: 'tabContent', overIndicator: null, overIndicatorRect: new DOMRect() }

            this.targetId = tabContentDom.getAttribute('data-tab-content-id')
            const rect = document.querySelector(`[data-id="${this.targetId}"]`)?.getBoundingClientRect()

            if (this.targetId === this.source.id) {
              this.over.overIndicatorRect = rect.toJSON()
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
                  this.over.overIndicator = item.indicator
                  this.over.overIndicatorRect = item.overIndicatorRect
                  break
                }
                continue
              }

              if (isPointInTriangle({ x: moveEvt.clientX, y: moveEvt.clientY }, item.a, item.b, item.c)) {
                this.over.overIndicator = item.indicator
                this.over.overIndicatorRect = item.overIndicatorRect
                break
              }
            }
          }
        }

        findClosestNode()
      },
      onDragEnd: ({ isCanceled }) => {
        if (isCanceled) {
          this.clearTouch()
          this.source = null
          return
        }

        const over = this.over

        if (!over) {
          return
        }

        switch (over.overType) {
          case 'root': {
            this.onLayoutRootDrop()
            break
          }
          case 'tabItem': {
            this.onTabItemDrop()
            break
          }
          case 'tabContent': {
            const { config } = findNodeById(this.targetId, this.layout)
            this.onLayoutDrop(config as ITabs)
            break
          }
        }

        this.clearTouch()

        this.source = null
      }
    })
  }

  // RootDrop
  onLayoutRootDrop() {
    const rootNode = this.layout
    const source = toJS(this.source)
    const { overIndicator } = this.over

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
        children: [{ ...rootNode, isRoot: false, style: { flexGrow: 80 } }]
      }

      if (overIndicator === 'right' || overIndicator === 'bottom') {
        config.children.push(newConfig)
      } else {
        config.children.unshift(newConfig)
      }

      this.layout = cloneDeep(config)
    }

    fixLayout(this.layout)
    console.log('this.layout', this.layout)

    validateLayout(this.layout)
  }

  // 放在布局块时
  onLayoutDrop(target: ITabs) {
    let { source } = this
    source = toJS(source)

    const { overIndicator } = this.over

    if (!source) {
      return
    }

    if (source.id === target.id) {
      console.log('不能 ld 了 0')
      return
    }

    if (target.children.length === 1 && target.children.some(item => item.id === source.id)) {
      console.log('不能 ld 了')
      return
    }

    removeItem(source, this.layout)

    const targetParent = findParentNode(target.id, this.layout)
    const index = targetParent.children.findIndex(item => item.id === target.id)

    // debug
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
    }

    fixLayout(this.layout)
    this.layout = cloneDeep(this.layout)
    console.log('layout', toJS(this.layout))

    validateLayout(this.layout)

    this.source = null
  }

  // 放在 tab 项时
  onTabItemDrop() {
    let { source, over } = this
    source = toJS(source)

    if (!source) {
      return
    }

    const sourceParent = findParentNode(source.id, this.layout)
    const originIndex = sourceParent.children.findIndex(item => item.id === source.id)

    let index = over.overTabIndex
    // 在同一个数组内移动, 索引需要调整
    if (sourceParent.id === over.overTabNode.id) {
      if (index > originIndex) {
        index = index - 1
      }
    }

    removeItem(source, this.layout)
    over.overTabNode.children.splice(index, 0, ...source2TabList(source))

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
