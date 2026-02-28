'use client'

import DragSortFlip from './z-page/drag-sort-flip'
import { DragSortMy } from './z-page/drag-sort-my'

export default function page() {
  return (
    <div className="flex">
      {/* <DragSortFlip /> */}

      <DragSortMy />
    </div>
  )
}
