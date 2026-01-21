'use client'

import { observer } from 'mobx-react-lite'
import V1 from './V1/V1'
import V2 from './V2/V2'

import './style.scss'

function ZrDragIndex() {
  return (
    <div className="zrDragIndex">
      {/* <V1 /> */}
      <V2 />
    </div>
  )
}

export default observer(ZrDragIndex)
