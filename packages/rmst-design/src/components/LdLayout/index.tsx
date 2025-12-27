'use client'

import { useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Item } from './Item'
import { LdContext } from './context'
import { IConfig } from './config'
import { LdStore } from './store'
import { useUpdate } from '../_util/hooks'

import './style.less'
import { Portal } from '../Portal'

interface LdLayoutProps {
  layout: IConfig
}

export const LdLayout = function LdLayout(props: LdLayoutProps) {
  const { layout } = props

  const update = useUpdate()

  const [portals, setPortals] = useState([])
  const [ldStore] = useState(() => {
    const store = new LdStore()

    store.setLayout(layout)
    store.nAverage()
    return store
  })

  useLayoutEffect(() => {
    ldStore.onLayoutChange = () => {
      rerender()
      update()
    }

    rerender()
  }, [])

  const rerender = () => {
    let portals = []

    for (const [k, value] of ldStore.ContentEmMap) {
      portals.push(createPortal(<>{value.reactElement}</>, value.div))
    }

    setPortals(portals)
  }

  const source = ldStore.source as any
  const { over } = ldStore

  return (
    <div className="rmst-ld-layout" ref={el => void (ldStore.rootLayoutEl = el)}>
      <LdContext value={{ rerender, ldStore }}>
        <Item config={ldStore.layout} />
      </LdContext>

      {portals}

      {over && (
        <Portal>
          <div
            className="rmst-ld-layout-over-indicator-rect"
            style={{
              left: over.indicatorRect.left,
              top: over.indicatorRect.top,
              width: over.indicatorRect.width,
              height: over.indicatorRect.height
            }}
          />
        </Portal>
      )}

      {source && (
        <Portal>
          <div
            className="rmst-ld-layout-source-indicator"
            style={{ left: ldStore.sourcePosition.x, top: ldStore.sourcePosition.y }}
          >
            {source.mode === 'tabs' ? `${source.children[0].title} 等 ${source.children.length} 个 tab` : source.title}
          </div>
        </Portal>
      )}
    </div>
  )
}
