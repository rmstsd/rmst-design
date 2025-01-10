import { IConfig } from './config'

export const config: IConfig = {
  type: 'row',
  id: 'root-id',
  children: [
    {
      type: 'row',
      id: 'bbb',
      children: [
        {
          type: 'tabset',
          id: 'ccc',
          children: [
            {
              type: 'tab',
              id: 'ddd',
              component: 'code'
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
                  component: 'description'
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
                  component: 'submissions'
                },
                {
                  type: 'tab',
                  id: 'ghji',
                  component: 'testcase'
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
                  component: 'result'
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
          component: 'note'
        },
        {
          type: 'tab',
          id: 'fgj9905',
          component: 'solutions'
        }
      ]
    }
  ]
}
