'use client'

import { useRef, useState } from 'react'
import { Button, Portal, Trigger, useIsSSR } from 'rmst-design'

export default function TriggerDd() {
  const ref = useRef<HTMLButtonElement>(null)

  const isSSR = useIsSSR()

  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(!open)
        }}
      >
        open
      </Button>
      <Trigger popup={<div>popup</div>}>
        <Button onClick={() => {}}>click</Button>
      </Trigger>

      <hr className="my-3" />

      <Trigger
        value
        _debugName="1"
        popup={
          <div className="border border-slate-200 p-3">
            <div className="mb-2">哈哈哈哈 popup 1</div>
            <Trigger
              value
              _debugName="2"
              popup={
                <div className="border border-slate-200 popup-2 p-3 flex gap-2">
                  <span>哈哈哈哈哈哈 popup 2</span>
                  <Trigger value _debugName="2" popup={<div className="border border-slate-200 popup-2 p-3">哈哈 popup 3</div>}>
                    <Button>继续打开</Button>
                  </Trigger>
                </div>
              }
            >
              <Button>继续打开</Button>
            </Trigger>
          </div>
        }
      >
        <Button>嵌套使用</Button>
      </Trigger>

      <hr className="my-3" />

      <Trigger popup={<div>受控 popup</div>}>
        <Button style={{ marginTop: 400 }}>受控</Button>
      </Trigger>

      <hr className="my-3" />

      <Trigger popup={<div>非受控 popup</div>}>
        <Button>非受控</Button>
      </Trigger>
    </div>
  )
}
