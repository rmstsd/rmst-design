'use client'

import { ClaudeSort } from './z-page/claude-sort'
import { DragSortMy } from './z-page/drag-sort-my'

export default function page() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* <DragSortFlip /> */}

      <DragSortMy />

      {/* <ClaudeSort /> */}
    </div>
  )
}
