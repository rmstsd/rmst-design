'use client'

import { Item } from './Item'

import { useLayoutEffect, useMemo, useState } from 'react'
import { fixLayout, IConfig, isLayoutNode, TabsNode, Total_Grow, traverse, validateLayout } from './config'

import { Button } from '../Button'
import { createPortal } from 'react-dom'
import { LdContext } from './context'
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
  const ldStore = useMemo(() => {
    const store = new LdStore()

    store.setLayout(layout)
    return store
  }, [])

  useLayoutEffect(() => {
    ldStore.onLayoutChange = () => {
      update()
    }
  }, [ldStore])

  useLayoutEffect(() => {
    // 初始化 n 等分
    traverse(ldStore.layout, item => {
      if (isLayoutNode(item)) {
        if (item.isRoot) {
          item.style ??= { flexGrow: Total_Grow }
        }
      }

      if (isLayoutNode(item)) {
        item.children?.forEach(child => {
          child.style ??= {
            flexGrow: Total_Grow / item.children.length
          }
        })
      } else if (item.mode === 'tabs') {
        const _item = item as TabsNode
        if (!_item.selected) {
          _item.selected = _item.children[0]?.id
        }
      }
    })

    rerender()
  }, [])

  const rerender = () => {
    let portals = []

    traverse(ldStore.layout, item => {
      if (item.mode === 'tabs') {
        item.children.forEach(tabItem => {
          const cache = ldStore.ContentEmMap.get(tabItem.id)

          if (!cache) {
            const div = document.createElement('div')
            div.className = 'portal-item'
            ldStore.ContentEmMapSet(tabItem.id, 'div', div)

            ldStore.ContentEmMapSet(tabItem.id, 'reactElement', tabItem.content)
          }

          portals.push(
            createPortal(<>{ldStore.ContentEmMap.get(tabItem.id)?.reactElement}</>, ldStore.ContentEmMap.get(tabItem.id)?.div)
          )
        })
      }
    })
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
