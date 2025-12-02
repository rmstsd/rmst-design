import { observer } from 'mobx-react-lite'
import ldStore, { ContentEmMap } from './store'
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ITabs, traverse } from './config'
import clsx from 'clsx'

export const PortalContainer = observer(() => {
  let tabContents: { id: string; content }[] = []

  traverse(ldStore.layout, item => {
    if (item.mode === 'tabs') {
      const config = item as ITabs

      tabContents.push(
        ...config.children.map(c => {
          return { tabsId: config.id, id: c.id, visible: config.selected === c.id, content: ContentEmMap[c.id], config }
        })
      )
    }
  })

  return (
    <section className="portal-container">
      {tabContents.map(tc => (
        <PortalItem key={tc.id} tc={tc} />
      ))}
    </section>
  )
})

const PortalItem = observer(({ tc }: any) => {
  const indicators = ['top', 'right', 'bottom', 'left']
  const [overIndicator, setOverIndicator] = useState('')

  // 懒加载
  const noLoadRef = useRef(true)
  if (!tc.visible && noLoadRef.current) {
    return null
  }
  noLoadRef.current = false

  const onDrop = overIndicator => {
    setOverIndicator('')
    ldStore.onLayoutDrop(overIndicator, tc.config)
  }

  const rect = ldStore.tabsSize.get(tc.id)

  return (
    <div
      key={tc.id}
      data-tabs-id={tc.tabsId}
      className="portal-item"
      style={{ left: rect?.x, top: rect?.y, width: rect?.width, height: rect?.height, display: tc.visible ? 'block' : 'none' }}
    >
      {tc.content}

      <div onDragOver={evt => evt.preventDefault()}>
        {indicators.map(item => (
          <div
            key={item}
            className={clsx(`indicator ${item}`, { over: overIndicator === item })}
            onDragEnter={() => setOverIndicator(item)}
            onDragLeave={() => setOverIndicator('')}
            onDrop={() => onDrop(item)}
          ></div>
        ))}
      </div>
    </div>
  )
})
