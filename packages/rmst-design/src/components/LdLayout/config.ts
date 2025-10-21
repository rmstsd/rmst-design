export type ITabs = { id: string; children: { id: string; title: string }[] }

export interface IConfig {
  mode?: 'row' | 'column' | 'tabs'
  id: string
  children?: (IConfig | ITabs)[]
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

        parent.children.splice(index, 1, node.children[0])
      }

      for (const item of node.children ?? []) {
        dfs(item)
      }
    }
  }
}
