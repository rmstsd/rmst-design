export interface IConfig {
  type: string
  component?: string
  children?: IConfig[]
}

export const getComponentByName = (name: string) => {
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

export const config = {
  type: 'row',
  children: [
    {
      type: 'row',
      weight: 36.95987365295846,
      children: [
        {
          type: 'tabset',
          weight: 26.357466063348415,
          foldBeforeWeight: 25.76810994689382,
          children: [
            {
              type: 'tab',
              component: 'code',
              enableRenderOnDemand: false
            }
          ],
          selected: 0
        },
        {
          type: 'row',
          weight: 73.64253393665159,
          children: [
            {
              type: 'tabset',
              weight: 25.178753830439224,
              foldBeforeWeight: 25.178753830439224,
              children: [
                {
                  type: 'tab',
                  component: 'description'
                }
              ],
              selected: 0
            },
            {
              type: 'tabset',
              weight: 43.85293582143441,
              selected: 1,
              foldBeforeWeight: 34.12140324488491,
              children: [
                {
                  type: 'tab',
                  component: 'submissions'
                },
                {
                  type: 'tab',
                  component: 'testcase'
                }
              ]
            },
            {
              type: 'tabset',
              weight: 30.968310348126362,
              foldBeforeWeight: 31.54746172965864,
              children: [
                {
                  type: 'tab',
                  component: 'result'
                }
              ],
              selected: 0
            }
          ]
        }
      ]
    },
    {
      type: 'tabset',
      weight: 26.443330656310742,
      selected: 1,
      foldBeforeWeight: 21.748254902122284,
      children: [
        {
          type: 'tab',
          component: 'note',
          enableClose: true
        },
        {
          type: 'tab',
          component: 'solutions'
        }
      ],
      active: true
    }
  ]
}
