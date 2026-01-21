import { observer } from 'mobx-react-lite'
import Aside from './Aside'
import Flow from './Flow'
import Ghost from './Ghost'
import { store } from './store'

function V1() {
  const text = JSON.stringify(store.rootNode, null, 2)

  return (
    <div className="flex h-full">
      <Aside />

      <Flow />

      <Ghost />

      <div className="w-[300px]">
        <button
          onClick={() => {
            navigator.clipboard.writeText(text).then(() => {
              console.log('copy success')
            })
          }}
        >
          copy
        </button>
        <pre>{text}</pre>
      </div>
    </div>
  )
}

export default observer(V1)
