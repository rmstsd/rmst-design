'use client'

import { useState } from 'react'
import { Button, Scrollbar } from 'rmst-design'

export default function ScrollbarDd() {
  const [list, setList] = useState(() => Array.from({ length: 10 }, (_, i) => i))
  const [height, setHeight] = useState(100)

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Button onClick={() => setList(prev => [...prev, ...Array.from({ length: 5 }, (_, i) => i + prev.length)])}>
          添加 5 个 item
        </Button>
        <Button onClick={() => setList(prev => prev.toSpliced(prev.length - 5, 5))}>删除 5 个 item</Button>
        <Button onClick={() => setHeight(height + 50)}>高度 + 50</Button>
        <Button onClick={() => setHeight(height - 50)}>高度 - 50</Button>
      </div>

      <Scrollbar style={{ height: `${height}px`, resize: 'vertical', overflow: 'hidden' }}>
        {list.map(item => (
          <div key={item} className="my-2">
            {item}
          </div>
        ))}
      </Scrollbar>
    </div>
  )
}
