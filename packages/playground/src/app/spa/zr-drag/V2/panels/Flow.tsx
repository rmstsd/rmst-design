import { observer } from 'mobx-react-lite'

import { store } from '../store/store'
import TaskNode from '../TaskNode'
import { useState } from 'react'

function Flow() {
  if (!store.activeFlow) {
    return null
  }

  const { activeFlow } = store

  return (
    <main className="w-0 grow touch-none select-none p-6 flex flex-col gap-2">
      <div className="tab-header flex items-center gap-2">
        {store.flowList.map((item, index) => (
          <div key={item.id} onClick={() => store.setActiveFlow(item)} className="flex gap-2 border px-2">
            {item.title}

            {index !== 0 && <button onClick={() => store.removeFlow(item.id)}>x</button>}
          </div>
        ))}
        <button onClick={() => store.addFlow()}>+</button>
      </div>

      <div className="flex grow gap-2 h-0">
        <section className="h-full flex-shrink-0 grow touch-none overflow-auto">
          <TaskNode node={activeFlow.rootNode} />
        </section>

        <pre
          className="h-full w-1/3 flex-shrink-0 overflow-auto"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(activeFlow.rootNode, null, 2)).then(() => {
              console.log('Copied to clipboard')
            })
          }}
        >
          {JSON.stringify(activeFlow.rootNode, null, 2)}
        </pre>
      </div>

      {/* <Tabs
        activeTab={store.activeFlow.id}
        onAddTab={() => store.addFlow()}
        onDeleteTab={key => store.removeFlow(key)}
        onChange={key => {
          store.setActiveFlow(store.flowList.find(f => f.id === key) || store.flowList[0])
        }}
      >
        {store.flowList.map(item => (
          <Tabs.TabPane key={item.id} title={item.title} className="flex items-start">
          
          </Tabs.TabPane>
        ))}
      </Tabs> */}
    </main>
  )
}

export default observer(Flow)
