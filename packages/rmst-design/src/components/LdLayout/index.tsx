'use client'

import './style.less'
import { Item } from './Item'

import { observer } from 'mobx-react-lite'
import ldStore from './store'
import { useLayoutEffect } from 'react'
import { traverse } from './config'
import { cloneDeep } from 'es-toolkit'

export const LdLayout = observer(function LdLayout() {
  useLayoutEffect(() => {
    // 初始化 n 等分
    traverse(ldStore.layout, item => {
      if (item.mode === 'row' || item.mode === 'column') {
        item.children?.forEach(child => {
          child.style ??= {
            flexGrow: 1 / item.children.length
          }
        })
      }
    })
  }, [])

  return (
    <div className="rt-ld-layout">
      <Item config={ldStore.layout} />

      {ldStore.source && (
        <div className="source-indicator" style={{ left: ldStore.sourcePosition.x, top: ldStore.sourcePosition.y }}>
          {ldStore.source.mode === 'tabs'
            ? `${ldStore.source.children[0].title} 等 ${ldStore.source.children.length} 个`
            : ldStore.source.title}
        </div>
      )}
    </div>
  )
})
