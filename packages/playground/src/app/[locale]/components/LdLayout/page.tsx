'use client'

import { ClientOnly } from '@/components/ClientOnly'
import { useEffect, useLayoutEffect, useState } from 'react'
import { LdLayout } from 'rmst-design'
import ButtonDd from '../Button/page'
import TextEllipsisDd from '../TextEllipsis/page'
import ModalDd from '../Modal/page'
import InputDd from '../Input/page'
import DrawerDd from '../Drawer/page'
import SelectDd from '../Select/page'
import SwitchDd from '../Switch/page'
import DatePickerDd from '../DatePicker/page'
import ImageDd from '../Image/page'
import CollapseDd from '../Collapse/page'
import MaskDd from '../Mask/page'
import ScrollbarDd from '../Scrollbar/page'

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
  const [layout] = useState({
    mode: 'row',
    id: genId(),
    isRoot: true,
    children: [
      {
        mode: 'tabs',
        id: genId(),
        children: [
          { id: '1', title: 'Button', content: <ButtonDd /> },
          { id: '2', title: 'TextEllipsis', content: <TextEllipsisDd /> }
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
              { id: '3', title: 'Modal', content: <ModalDd /> },
              { id: '4', title: 'Drawer', content: <DrawerDd /> }
            ]
          },
          {
            mode: 'tabs',
            id: genId(),
            children: [
              { id: '5', title: 'Input', content: <InputDd /> },
              { id: '6', title: 'Select', content: <SelectDd /> },
              { id: '7', title: 'DatePicker', content: <DatePickerDd /> },
              { id: '8', title: 'Switch', content: <SwitchDd /> }
            ]
          }
        ]
      },
      {
        mode: 'tabs',
        id: genId(),
        children: [
          { id: '45', title: 'Image', content: <ImageDd /> },
          { id: '22', title: 'Collapse', content: <CollapseDd /> },
          { id: '2t2', title: 'Mask', content: <MaskDd /> },
          { id: '2tyy2', title: 'Scrollbar', content: <ScrollbarDd /> }
        ]
      }
    ]
  })

  return (
    <ClientOnly>
      <div>
        <LdLayout layout={layout as any} className="demo-ld-layout" style={{ height: '700px' }} />
      </div>
    </ClientOnly>
  )
}
