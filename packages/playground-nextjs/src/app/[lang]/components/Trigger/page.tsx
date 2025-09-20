'use client'

import { useRef, useState } from 'react'
import { Button, Trigger } from 'rmst-design'

export default function TriggerDd() {
  const ref = useRef<HTMLButtonElement>(null)

  const [open, setOpen] = useState(true)

  return (
    <div>
      <Trigger popup={<div>popup</div>}>
        <Button
          ref={ref}
          onClick={() => {
            console.log('click', ref.current)
          }}
        >
          click
        </Button>
      </Trigger>

      <hr />

      <Trigger popup={<div>popup</div>}>
        <div style={{ border: '1px solid red' }}>
          <input type="text" />
          <h1>aa</h1>
          <b>bb</b>
        </div>
      </Trigger>

      <Trigger value={open} onChange={visible => setOpen(visible)} popup={<div>受控 popup</div>}>
        <Button style={{ marginTop: 400 }}>受控</Button>
      </Trigger>

      <Trigger popup={<div>非受控 popup</div>}>
        <Button style={{ marginTop: 400 }}>非受控</Button>
      </Trigger>
    </div>
  )
}
