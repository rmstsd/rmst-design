import { FunctionComponent, ReactNode } from 'react'

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

export interface IConfig {
  mode?: 'row' | 'column' | 'tabs'
  id: string
  children?: (IConfig | ITabs)[]

  style?: {
    flexGrow?: number
  }
}

export interface IComponent {
  config: IConfig
  parent: IConfig
}

export const getComponentByName = (name: string, config: IConfig): IComponent => {
  return dfs(config, null)

  function dfs(config: IConfig, parent: IConfig | null) {
    if (config.id === name) {
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

export const getComponentById = (id: string, config: IConfig): IComponent => {
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

export const removeItem = (config: IConfig, rootTree: IConfig) => {
  const parent = findParentNode(config.id, rootTree)

  const index = parent.children.indexOf(config)
  if (index === -1) {
    console.error('removeItem error')

    return
  }
  parent.children.splice(index, 1)

  // 删除后, 均分给其他子项
  const average = config.style.flexGrow / parent.children.length
  parent.children.forEach(item => {
    item.style.flexGrow += average
  })

  return index
}

export const genId = () => {
  return Math.random().toString().slice(2, 6)
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

export function fixLayout(layout: IConfig) {
  dfs(layout)

  function dfs(node: IConfig) {
    if (node.mode === 'column' || node.mode === 'row') {
      if (node.children.length === 1) {
        const parent = findParentNode(node.id, layout)
        const index = parent.children.findIndex(p => p.id === node.id)

        if (index === -1) {
          console.error('fixLayout error')
          return
        }

        const child = node.children[0]
        child.style.flexGrow = node.style.flexGrow

        parent.children.splice(index, 1, child)
      }

      // const sum = node.children.reduce((pre, cur) => pre + (cur.style.flexGrow ?? 0), 0)
      // const average = (Total_Grow - sum) / node.children.length
      // node.children.forEach(child => {
      //   child.style.flexGrow += average
      // })

      for (const item of node.children ?? []) {
        dfs(item)
      }
    }
  }
}

export function validateLayout(layout: IConfig) {
  traverse(layout, item => {
    if (item.mode === 'column' || item.mode === 'row') {
      const sum = item.children.reduce((pre, cur) => pre + cur.style.flexGrow, 0)

      if (sum - 100 > 0.0001) {
        console.error('不对')
      }
    } else if (item.mode === 'tabs') {
      // 修正选中项
      const tabsConfig = item as ITabs
      if (!tabsConfig.children.map(child => child.id).includes(tabsConfig.selected)) {
        tabsConfig.selected = tabsConfig.children[0].id
      }
    }
  })
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
