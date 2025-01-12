export interface IConfig {
  type: string
  id: string
  component?: string
  children?: IConfig[]
}

export const getComponentByName = (name: string, config: IConfig): { config: IConfig; parent: IConfig } => {
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
export const getComponentById = (id: string, config: IConfig): { config: IConfig; parent: IConfig } => {
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
      if (config.children && config.children.length === 0) {
        parent.children.splice(parent.children.indexOf(config), 1)
        return
      }
      if (config.type === 'row') {
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

export const removeItem = (config: IConfig, parent: IConfig) => {
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
