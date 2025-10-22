'use client'

import './style.less'
import { Item } from './Item'

import { observer } from 'mobx-react-lite'
import ldStore from './store'
import { useLayoutEffect } from 'react'

export const LdLayout = observer(function LdLayout() {
  return (
    <div className="rt-ld-layout">
      <Item config={ldStore.layout} />

      {ldStore.source && (
        <div className="source-indicator" style={{ left: ldStore.sourcePosition.x, top: ldStore.sourcePosition.y }}>
          {ldStore.source.title}
        </div>
      )}
    </div>
  )
})
