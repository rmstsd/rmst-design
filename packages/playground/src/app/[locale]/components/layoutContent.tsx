'use client'

import Side from '@/components/Side'
import { PropsWithChildren, useState } from 'react'
import { Button } from 'rmst-design'

import Cookies from 'js-cookie'
import { Side_Open_Key } from './constant'
import { updateSideOpen } from '@/actions/updateSideOpen'

const width = 160

interface LayoutContentProps {
  sideOpen?: string
}

export default function LayoutContent(props: PropsWithChildren<LayoutContentProps>) {
  const [isExpandedState, setIsExpandedState] = useState(() => (props.sideOpen ? props.sideOpen === 'true' : true))

  // const isExpandedState = props.sideOpen === 'true'

  return (
    <>
      <div
        className="shrink-0 fixed top-[48px] left-0 bottom-0 z-10 bg-white transition-all"
        style={{ width: width, marginLeft: isExpandedState ? '' : -width }}
      >
        <Side />

        <div className="side-menu-expand-btn transition-all" style={{ left: isExpandedState ? width + 12 : 12 }}>
          <Button
            onClick={() => {
              const newVal = !isExpandedState

              updateSideOpen({ sideOpen: newVal.toString() })

              setIsExpandedState(newVal)
              // Cookies.set(Side_Open_Key, newVal.toString())
            }}
          >
            {isExpandedState ? '<' : '>'}
          </Button>
        </div>
      </div>

      <section className="p-2 grow transition-all" style={{ marginLeft: isExpandedState ? width : '' }}>
        {props.children}
      </section>
    </>
  )
}
