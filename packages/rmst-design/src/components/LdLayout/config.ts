export interface IConfig {
  type: 'row' | 'column' | 'tabset' | 'tab'
  id: string
  component?: string
  children?: IConfig[]
}

export interface IComponent {
  config: IConfig
  parent: IConfig
}

export const getComponentByName = (name: string, config: IConfig): IComponent => {
  return dfs(config, null)

  function dfs(config: IConfig, parent: IConfig | null) {
    if (config.component === name) {
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

export function fixConfig(config: IConfig) {
  dfs(config, null)

  function dfs(config: IConfig, parent: IConfig) {
    if (parent) {
      if (config.type === 'row' || config.type === 'column') {
        if (config.children && config.children.length === 1) {
          const child = config.children[0]

          const index = parent.children.indexOf(config)

          parent.children.splice(index, 1, ...child.children)
        }
      }
    }

    if (config.children) {
      for (const item of config.children) {
        dfs(item, config)
      }
    }
  }
}

export const removeItem = (config: IConfig, rootTree: IConfig) => {
  const parent = findParentNode(config, rootTree)

  const index = parent.children.indexOf(config)
  if (index === -1) {
    console.error('removeItem error')

    return
  }
  parent.children.splice(index, 1)

  return index
}

export const genId = () => {
  return Math.random().toString()
}

export function findParentNode(item: IConfig, node: IConfig): IConfig {
  return dfs(node)

  function dfs(node: IConfig, parent = null) {
    if (item === node) {
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
