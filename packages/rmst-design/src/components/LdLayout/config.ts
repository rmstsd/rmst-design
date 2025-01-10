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
    if (config.children && config.children.length === 0) {
      parent.children.splice(parent.children.indexOf(config), 1)
    }

    if (config.children) {
      for (const item of config.children) {
        dfs(item, config)
      }
    }
  }
}
