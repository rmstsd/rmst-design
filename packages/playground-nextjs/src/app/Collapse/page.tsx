'use client'
import { useState } from 'react'
import { Button, Collapse } from 'rmst-design'

export default function CollapseDd() {
  const [list, setList] = useState([0])

  return (
    <div>
      <Button onClick={() => setList([...list, 1])}>动态更新内容</Button>
      <h3>基础</h3>
      <Collapse
        defaultActiveKey={['a', 'c']}
        items={[
          {
            onlyKey: 'a',
            title: 'title A',
            children: (
              <div>
                {list.map((_, idx) => (
                  <div key={idx}>This is item {idx + 1}</div>
                ))}
              </div>
            )
          },
          { onlyKey: 'b', title: 'title B', children: <div>This is item B</div> },
          { onlyKey: 'c', title: 'title C', children: <div>This is item C</div> }
        ]}
      ></Collapse>

      <div className="h-20"></div>

      <h3>手风琴</h3>
      <Collapse
        accordion
        defaultActiveKey={['a', 'c']}
        items={[
          { onlyKey: 'b', title: 'title B', children: <div>This is item B</div> },
          { onlyKey: 'c', title: 'title C', children: <div>This is item C</div> },
          { onlyKey: 'd', title: 'title D', children: <div>This is item D</div> }
        ]}
      ></Collapse>

      <div>更多...</div>
    </div>
  )
}
