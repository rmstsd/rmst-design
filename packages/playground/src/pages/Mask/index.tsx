import { useState } from 'react'
import { Button, Mask } from 'rmst-design'

export default function MaskDd() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>显示遮罩层</Button>

      <Mask open={open} />
    </div>
  )
}
