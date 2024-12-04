import { useRef } from 'react'
import { Button, Trigger } from 'rmst-design'

export default function TriggerDd() {
  const ref = useRef<HTMLButtonElement>(null)

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

      <Trigger popup={<div style={{ backgroundColor: 'white', width: 200, height: 200 }}>popup</div>}>
        <Button style={{ marginTop: 400 }}>click</Button>
      </Trigger>
    </div>
  )
}
