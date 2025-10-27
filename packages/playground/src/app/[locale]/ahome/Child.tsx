'use client'

import { startTransition, useState, ViewTransition } from 'react'
import { Button } from 'rmst-design'

import './child.scss'

export default function Child() {
  const [show, setShow] = useState(false)
  return (
    <div className="p-10">
      <Button
        onClick={() =>
          startTransition(() => {
            setShow(!show)
          })
        }
      >
        click
      </Button>

      {show && (
        <ViewTransition default="slow-fade">
          <div>Hi</div>
        </ViewTransition>
      )}

      <div>555</div>
    </div>
  )
}
