import { ReactNode } from 'react'

export const Total_Grow = 100

export type ITabs = {
  id: string
  children: { id: string; title: string; content?: ReactNode }[]
  selected?: string
  style?: {
    flexGrow?: number
    rect?: { x: number; y: number; width: number; height: number }
  }
}

export type OverIndicator = 'top' | 'bottom' | 'left' | 'right' | 'center'
export type OverType = 'root' | 'tabItem' | 'tabContent'

export type Over = {
  overType: OverType
  overIndicator: OverIndicator
  overIndicatorRect

  //
  overTabIndex?: number
  overTabNode?
}

export function source2TabList(source) {
  if (source.mode === 'tabs') {
    return source.children
  }

  return [source]
}

export const isLayoutNode = (node: IConfig) => {
  return node.mode === 'row' || node.mode === 'column'
}

export interface IConfig {
  mode?: 'row' | 'column' | 'tabs'
  id: string
  isRoot?: boolean
  children?: (IConfig | ITabs)[]

  style?: {
    flexGrow?: number
  }
}

export interface IComponent {
  config: IConfig
  parent: IConfig
}

export const removeItem = (config: IConfig, rootTree: IConfig) => {
  const parent = findParentNode(config.id, rootTree)

  const index = parent.children.findIndex(item => item.id === config.id)
  if (index === -1) {
    console.error('removeItem error')
    return
  }
  parent.children.splice(index, 1)

  // 只对 mode 是 tabs 和 layout 节点生效
  if (config.mode) {
    // 删除后, 均分给其他子项
    const average = config.style.flexGrow / parent.children.length
    parent.children.forEach(item => {
      item.style.flexGrow += average
    })
  }

  // 处理删除 tabItem 后
  if (parent.children.length === 0) {
    removeItem(parent, rootTree)
  }
}

export const findNodeById = (id: string, config: IConfig): IComponent => {
  return dfs(config, null)

  function dfs(config: IConfig, parent: IConfig | null) {
    if (config.id === id) {
      return { config, parent }
    } else {
      if (config.children) {
        for (const item of config.children) {
          const ans = dfs(item, config)

          if (ans) {
            return ans
          }
        }
      }
    }

    return null
  }
}

export function findParentNode(id: string, node: IConfig): IConfig {
  return dfs(node)

  function dfs(node: IConfig, parent = null) {
    if (id === node.id) {
      return parent
    }

    for (const item of node.children ?? []) {
      const res = dfs(item, node)
      if (res) {
        return res
      }
    }
  }
}

export const genId = () => {
  return Math.random().toString().slice(2, 6)
}

export function fixLayout(layout: IConfig) {
  postorderRecursive(layout, (node: IConfig) => {
    if (isLayoutNode(node)) {
      if (node.children.length === 0) {
        removeItem(node, layout)
      } else {
        if (node.children.length === 1) {
          const child = node.children[0] as IConfig

          node.children = child.children
          node.mode = child.mode
        }
      }

      const parent = findParentNode(node.id, layout)

      if (parent && node.mode === parent.mode) {
        const index = parent.children.indexOf(node)
        if (index === -1) {
          console.error('-1 bug')
        } else {
          node.children.forEach(item => {
            const ratio = item.style.flexGrow / Total_Grow
            item.style.flexGrow = ratio * node.style.flexGrow
          })

          parent.children.splice(index, 1, ...node.children)
        }
      }
    } else if (node.mode === 'tabs') {
      // 修正选中项
      const tabsConfig = node as ITabs
      if (!tabsConfig.children.map(child => child.id).includes(tabsConfig.selected)) {
        tabsConfig.selected = tabsConfig.children[0].id
      }
    }
  })
}

export function validateLayout(layout: IConfig) {
  if (!layout.isRoot) {
    console.error('根节点的 isRoot 应是 true')
  }

  let rootCount = 0
  traverse(layout, item => {
    if (item.isRoot) {
      rootCount++
    }

    if (isLayoutNode(item)) {
      const sum = item.children.reduce((pre, cur) => pre + cur.style.flexGrow, 0)

      if (isNotEqual(sum)) {
        console.error(item, 'flexGrow 的和 不对, 是', sum)
      }
    }
  })
  if (rootCount !== 1) {
    console.error('布局中只能有一个根节点')
  }

  rootCount = 0
  postorderRecursive(layout, item => {
    if (item.isRoot) {
      rootCount++
    }
    if (isLayoutNode(item)) {
      const sum = item.children.reduce((pre, cur) => pre + cur.style.flexGrow, 0)

      if (isNotEqual(sum)) {
        console.error(item, 'flexGrow 的和 不对, 是', sum)
      }
    }
  })

  if (rootCount !== 1) {
    console.error('布局中只能有一个根节点')
  }
}

const isNotEqual = (val: number) => {
  return Math.abs(val - 100) > 0.001
}

/**
 * 判断点是否在三角形内（含边线）
 * @param {Object} p - 待判断点 {x, y}
 * @param {Object} a - 三角形顶点A {x, y}
 * @param {Object} b - 三角形顶点B {x, y}
 * @param {Object} c - 三角形顶点C {x, y}
 * @returns {Boolean} true=在内部/边上，false=在外部
 */
export function isPointInTriangle(p, a, b, c) {
  // 计算叉乘：向量 ab × 向量 ap
  const crossAB = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)
  // 向量 bc × 向量 bp
  const crossBC = (c.x - b.x) * (p.y - b.y) - (c.y - b.y) * (p.x - b.x)
  // 向量 ca × 向量 cp
  const crossCA = (a.x - c.x) * (p.y - c.y) - (a.y - c.y) * (p.x - c.x)

  // 判断是否全部同向（均非负 或 均非正）
  const isAllPositive = crossAB >= 0 && crossBC >= 0 && crossCA >= 0
  const isAllNegative = crossAB <= 0 && crossBC <= 0 && crossCA <= 0

  return isAllPositive || isAllNegative
}

// ------------------- 测试示例 -------------------
// // 三角形顶点：A(0,0)、B(4,0)、C(2,3)
// const triangle = {
//     a: { x: 0, y: 0 },
//     b: { x: 4, y: 0 },
//     c: { x: 2, y: 3 }
// };

// // 测试点1：三角形内部 (2,1) → 应返回 true
// console.log(isPointInTriangle({x:2, y:1}, triangle.a, triangle.b, triangle.c)); // true

// N 叉树后序遍历
function postorderRecursive(root, fn) {
  // 递归辅助函数
  const traverse = node => {
    if (!node) return // 空节点直接返回

    // 1. 遍历所有子节点（从左到右）
    if (node.children) {
      for (const child of node.children) {
        traverse(child)
      }
    }

    fn(node)
  }

  traverse(root)
}

export function traverse(config: IConfig, traverseFn: (item: IConfig) => void) {
  dfs(config)

  function dfs(config: IConfig) {
    traverseFn(config)

    if (config.children) {
      for (const item of config.children) {
        dfs(item)
      }
    }
  }
}
