'use client'

import { ClientOnly } from '@/components/ClientOnly'
import { useEffect } from 'react'
import { LdLayout } from 'rmst-design'

let id = -991

function genId() {
  id += 1
  return id.toString()
}

const ContentEm = props => {
  useEffect(() => {
    console.log('useEffect', props.content)
  }, [])

  return (
    <>
      <h1>{props.content}</h1>
    </>
  )
}

export default function LdLayoutDd() {
  const layout = {
    mode: 'row',
    id: genId(),
    isRoot: true,
    children: [
      {
        mode: 'tabs',
        id: genId(),
        children: [
          { id: '1', title: 'Button', content: <ContentEm content="Button" /> },
          { id: '2', title: 'TextEllipsis', content: <ContentEm content="TextEllipsis" /> },
          { id: '3', title: 'Modal', content: <ContentEm content="Modal" /> }
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
              { id: '4', title: 'Drawer', content: <ContentEm content="Drawer" /> },
              { id: '5', title: 'Input', content: <ContentEm content="Input" /> },
              { id: '6', title: 'Select', content: <ContentEm content="Select" /> }
            ]
          },
          {
            mode: 'tabs',
            id: genId(),
            children: [
              { id: '7', title: 'DatePicker', content: <ContentEm content="DatePicker" /> },
              { id: '8', title: 'Switch', content: <ContentEm content="Switch" /> },
              { id: '45', title: 'Image', content: <ContentEm content="Image" /> }
            ]
          }
        ]
      },
      {
        mode: 'tabs',
        id: genId(),
        children: [
          { id: '22', title: 'Collapse', content: <ContentEm content="Collapse" /> },
          { id: 'at', title: 'Trigger', content: <ContentEm content="Trigger" /> },
          { id: '2t2', title: 'Mask', content: <ContentEm content="Mask" /> },
          { id: '2tyy2', title: 'Scrollbar', content: <ContentEm content="Scrollbar" /> }
        ]
      }
    ]
  }

  return (
    <ClientOnly>
      <div>
        <LdLayout layout={layout as any} />
      </div>
    </ClientOnly>
  )
}
