'use client'

import { useState } from 'react'
import { Button, Input, Modal, TextEllipsis } from 'rmst-design'

export default function Home() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>aaa</Button>

      <Input />
      <TextEllipsis rows={2}>
        阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖
        阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖
        阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖
      </TextEllipsis>

      <Modal open={isOpen} onCancel={() => setIsOpen(false)}>
        modal-content
      </Modal>
    </div>
  )
}
