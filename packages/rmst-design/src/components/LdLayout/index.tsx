'use client'

import { Item } from './Item'
import { observer } from 'mobx-react-lite'
import ldStore from './store'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { fixLayout, Total_Grow, traverse, validateLayout } from './config'

import './style.less'
import { Button } from '../Button'
import { createPortal } from 'react-dom'
import { LdContext } from './context'
import { ContentEmMap } from './PortalContainer'

export const LdLayout = observer(function LdLayout() {
  const [portals, setPortals] = useState([])

  useLayoutEffect(() => {
    // 初始化 n 等分
    traverse(ldStore.layout, item => {
      if (item.isRoot) {
        item.style ??= { flexGrow: Total_Grow }
      }

      if (item.mode === 'row' || item.mode === 'column') {
        item.children?.forEach(child => {
          child.style ??= {
            flexGrow: Total_Grow / item.children.length
          }
        })
      }
    })

    rerender()
  }, [])

  const rerender = () => {
    let portals = []

    traverse(ldStore.layout, item => {
      if (item.mode === 'tabs') {
        item.children.forEach(tabItem => {
          const dd = ldStore.ContentEmMap.get(tabItem.id)

          if (!dd) {
            const div = document.createElement('div')
            div.className = 'portal-item'
            ldStore.ContentEmMapSet(tabItem.id, 'div', div)

            const contentElement = ContentEmMap[tabItem.id]
            ldStore.ContentEmMapSet(tabItem.id, 'reactElement', contentElement)
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

  const [item, setItem] = useState(null)

  let itemRef = useRef(null)

  return (
    <div className="test">
      <div className="flex gap-2 bg-amber-200">
        <Button onClick={() => fixLayout(ldStore.layout)}>fix</Button>
        <Button onClick={() => validateLayout(ldStore.layout)}>验证</Button>
      </div>

      <div style={{ height: 10 }}></div>

      <div className="rt-ld-layout" ref={el => void (ldStore.rootLayoutEl = el)}>
        <LdContext value={{ rerender }}>
          <Item config={ldStore.layout} />
        </LdContext>

        {portals}

        {over && (
          <div
            className="over-indicator-rect"
            style={{
              left: over.indicatorRect.left,
              top: over.indicatorRect.top,
              width: over.indicatorRect.width,
              height: over.indicatorRect.height
            }}
          />
        )}

        {source && (
          <div className="source-indicator" style={{ left: ldStore.sourcePosition.x, top: ldStore.sourcePosition.y }}>
            {source.mode === 'tabs' ? `${source.children[0].title} 等 ${source.children.length} 个 tab` : source.title}
          </div>
        )}
      </div>

      <Button
        onClick={() => {
          if (!itemRef.current) {
            itemRef.current = document.createElement('div')
            itemRef.current.classList.add('portal-item-tt')
          }

          setItem(createPortal(<Test />, itemRef.current))
        }}
      >
        Insert
      </Button>
      {item}
    </div>
  )
})

function Test() {
  useEffect(() => {
    console.log('useEffect')

    return () => {
      console.log('useEffect return')
    }
  }, [])
  return <div>Test</div>
}
