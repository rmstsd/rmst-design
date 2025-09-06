'use client'

import { useState } from 'react'
import { Button, Mask } from 'rmst-design'

export default function MaskDd() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>显示</Button>

      <Mask open={open} isRenderToBody onClick={() => setOpen(false)} style={{ zIndex: 100 }} />
    </div>
  )
}
