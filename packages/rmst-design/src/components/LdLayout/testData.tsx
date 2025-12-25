import { genId, IConfig } from './config'
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'

export const ContentEm = props => {
  console.log('ContentEm render')

  useEffect(() => {
    console.log('useEffect', props.id)
  }, [])

  return <div className="content-em">{props.id} 的 content</div>
}

export const ContentEmMap = {
  '1': <ContentEm id="1" />,
  '2': <ContentEm id="2" />,
  '3': <ContentEm id="3" />,
  '4': <ContentEm id="4" />,
  '5': <ContentEm id="5" />,
  '6': <ContentEm id="6" />,
  '7': <ContentEm id="7" />,
  '8': <ContentEm id="8" />
}

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
          { id: '1', title: '1', content: ContentEmMap['1'] },
          { id: '2', title: '2', content: ContentEmMap['2'] }
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
              { id: '3', title: '3', content: ContentEmMap['3'] },
              { id: '4', title: '4', content: ContentEmMap['4'] }
            ]
          },
          {
            mode: 'tabs',
            id: genId(),
            children: [
              { id: '5', title: '5', content: ContentEmMap['5'] },
              { id: '6', title: '6', content: ContentEmMap['6'] }
            ]
          }
        ]
      },
      {
        mode: 'tabs',
        id: genId(),
        children: [
          { id: '7', title: '7', content: ContentEmMap['7'] },
          { id: '8', title: '8', content: ContentEmMap['8'] }
        ]
      }
    ]
  }
}
