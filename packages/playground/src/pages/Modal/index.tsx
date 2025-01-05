import { useState } from 'react'
import { Button, Modal } from 'rmst-design'

export default function ModalDd() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>open Modal</Button>

      <Modal open={open} onCancel={() => setOpen(false)}>
        modal-content
      </Modal>
    </div>
  )
}
