import { IConfig } from './config'

export const config: IConfig = {
  type: 'row',
  id: 'root-id',
  children: [
    {
      type: 'column',
      id: 'bbb',
      children: [
        {
          type: 'tabset',
          id: 'ccc',
          children: [
            {
              type: 'tab',
              id: 'ddd',
              component: '方法'
            }
          ]
        },
        {
          type: 'row',
          id: 'ttt',
          children: [
            {
              type: 'tabset',
              id: 'rtee',
              children: [
                {
                  type: 'tab',
                  id: 'jkl99',
                  component: '刚刚'
                }
              ]
            },
            {
              type: 'tabset',
              id: 'ioio',
              children: [
                {
                  type: 'tab',
                  id: 'asd',
                  component: '看'
                },
                {
                  type: 'tab',
                  id: 'ghji',
                  component: '几何'
                }
              ]
            },
            {
              type: 'tabset',
              id: 'wbki',
              children: [
                {
                  type: 'tab',
                  id: 'rtu889',
                  component: '具体'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'tabset',
      id: 'zzui765',
      children: [
        {
          type: 'tab',
          id: 'bn4465',
          component: '人员'
        },
        {
          type: 'tab',
          id: 'fgj9905',
          component: '吃饭'
        }
      ]
    }
  ]
}
