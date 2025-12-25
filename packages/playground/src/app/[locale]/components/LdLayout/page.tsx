import { ClientOnly } from '@/components/ClientOnly'
import { LdLayout } from 'rmst-design'

let id = -991

function genId() {
  id += 1
  return id.toString()
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
          { id: '1', title: 'Button', content: 'Button' },
          { id: '2', title: 'TextEllipsis', content: 'TextEllipsis' },
          { id: '3', title: 'Modal', content: 'Modal' }
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
              { id: '4', title: 'Drawer', content: 'Drawer' },
              { id: '5', title: 'Input', content: 'Input' },
              { id: '6', title: 'Select', content: 'Select' }
            ]
          },
          {
            mode: 'tabs',
            id: genId(),
            children: [
              { id: '7', title: 'DatePicker', content: 'DatePicker' },
              { id: '8', title: 'Switch', content: 'Switch' },
              { id: '45', title: 'Image', content: 'Image' }
            ]
          }
        ]
      },
      {
        mode: 'tabs',
        id: genId(),
        children: [
          { id: '22', title: 'Collapse', content: 'Collapse' },
          { id: 'at', title: 'Trigger', content: 'Trigger' },
          { id: '2t2', title: 'Mask', content: 'Mask' },
          { id: '2tyy2', title: 'Scrollbar', content: 'Scrollbar' }
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
