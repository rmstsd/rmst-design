'use client'

import { Item } from './Item'
import { observer } from 'mobx-react-lite'
import ldStore from './store'
import { useLayoutEffect } from 'react'
import { fixLayout, Total_Grow, traverse, validateLayout } from './config'
import { PortalContainer } from './PortalContainer'

import './style.less'
import { Button } from '../Button'

export const LdLayout = observer(function LdLayout() {
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
  }, [])

  const source = ldStore.source as any

  return (
    <div className="test">
      <div className="flex gap-2 bg-amber-200">
        <Button onClick={() => fixLayout(ldStore.layout)}>fix</Button>
        <Button onClick={() => validateLayout(ldStore.layout)}>验证</Button>
      </div>

      <div style={{ height: 10 }}></div>

      <div className="rt-ld-layout" ref={el => void (ldStore.rootLayoutEl = el)}>
        <Item config={ldStore.layout} />

        {/* <PortalContainer /> */}

        {ldStore.overIndicatorRect && (
          <div
            style={{
              transition: 'all 0.1s ease-in-out',
              position: 'fixed',
              left: ldStore.overIndicatorRect.left,
              top: ldStore.overIndicatorRect.top,
              width: ldStore.overIndicatorRect.width,
              height: ldStore.overIndicatorRect.height,
              backgroundColor: 'rgba(0, 0, 255, 0.3)',
              pointerEvents: 'none',
              border: '1px solid blue'
            }}
          />
        )}

        {source && (
          <div className="source-indicator" style={{ left: ldStore.sourcePosition.x, top: ldStore.sourcePosition.y }}>
            {source.mode === 'tabs' ? `${source.children[0].title} 等 ${source.children.length} 个` : source.title}
          </div>
        )}
      </div>
    </div>
  )
})
