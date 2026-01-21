import { useEventListener } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { store } from './store'

export default observer(function Ghost() {
  const { pos, draggedNode } = store

  useEventListener('pointermove', evt => {
    if (draggedNode) {
      store.pos.x = evt.clientX
      store.pos.y = evt.clientY
    }
  })

  if (!draggedNode) {
    return null
  }

  return (
    <div className="pointer-events-none fixed rounded-md bg-white p-4 shadow-lg" style={{ left: pos.x, top: pos.y }}>
      {draggedNode.title}
    </div>
  )
})
