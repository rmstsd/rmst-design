import { useState } from 'react'
import { Button, Modal } from 'rmst-design'

export default function ModalDd() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>open</Button>

      <Modal open={open} onCancel={() => setOpen(false)}></Modal>
    </div>
  )
}
