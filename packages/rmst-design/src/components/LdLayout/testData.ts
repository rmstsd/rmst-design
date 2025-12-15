import { genId, IConfig } from './config'

export function getDefaultLayout(): IConfig {
  return {
    mode: 'row',
    id: genId(),
    isRoot: true,
    children: [
      {
        mode: 'tabs',
        id: genId(),
        children: [
          { id: '1', title: '1' },
          { id: '2', title: '2' }
        ]
      },
      {
        mode: 'column',
        id: genId(),
        children: [
          {
            mode: 'tabs',
            id: genId(),
            children: [
              { id: '3', title: '3' },
              { id: '4', title: '4' }
            ]
          },
          {
            mode: 'tabs',
            id: genId(),
            children: [
              { id: '5', title: '5' },
              { id: '6', title: '6' }
            ]
          }
        ]
      },
      {
        mode: 'tabs',
        id: genId(),
        children: [
          { id: '7', title: '7' },
          { id: '8', title: '8' }
        ]
      }
    ]
  }
}
