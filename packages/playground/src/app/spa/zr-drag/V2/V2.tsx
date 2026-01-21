import { observer } from 'mobx-react-lite'

import Aside from './panels/Aside'
import Flow from './panels/Flow'
import Ghost from './Ghost'

import './style.scss'

function V2() {
  return (
    <div className="flex h-full">
      <Aside />

      <Flow />

      <Ghost />
    </div>
  )
}

export default observer(V2)
