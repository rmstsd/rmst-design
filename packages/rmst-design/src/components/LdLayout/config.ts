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
      children: [
        {
          type: 'row',
          weight: 26.357466063348415,
          children: [
            {
              type: 'tabset',
              weight: 50,
              foldBeforeWeight: 37.5,
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
              type: 'tabset',
              weight: 50,
              foldBeforeWeight: 50,
              children: [
                {
                  type: 'tab',
                  component: 'solutions'
                }
              ],
              selected: 0
            }
          ]
        },
        {
          type: 'row',
          weight: 73.64253393665159,
          children: [
            {
              type: 'tabset',
              weight: 25.178753830439224,
              foldBeforeWeight: 50,
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
              weight: 25.178753830439224,
              foldBeforeWeight: 33.333333333333336,
              children: [
                {
                  type: 'tab',
                  component: 'submissions'
                }
              ],
              selected: 0
            },
            {
              type: 'row',
              weight: 49.64249233912155,
              children: [
                {
                  type: 'tabset',
                  weight: 50,
                  foldBeforeWeight: 50,
                  children: [
                    {
                      type: 'tab',
                      component: 'testcase'
                    }
                  ],
                  selected: 0
                },
                {
                  type: 'tabset',
                  weight: 50,
                  foldBeforeWeight: 50,
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
        }
      ]
    },
    {
      type: 'tabset',
      weight: 33.333333333333336,
      foldBeforeWeight: 41.66666666666667,
      children: [
        {
          type: 'tab',
          component: 'note',
          enableClose: true
        }
      ],
      active: true,
      selected: 0
    }
  ]
}
