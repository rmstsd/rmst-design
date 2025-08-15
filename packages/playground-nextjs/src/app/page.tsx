'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { Button, Input, Modal, TextEllipsis } from 'rmst-design'

let syb = () => {
  return () => {}
}

function client() {
  return 2
}

function server() {
  return 1
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(true)

  const value = useSyncExternalStore(syb, client, server)

  return (
    <div className="p-4">
      {value}
      <Button onClick={() => setIsOpen(true)}>aaa</Button>

      <Input />
      <TextEllipsis rows={2}>
        阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖
        阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖
        阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖
      </TextEllipsis>
      <TextEllipsis rows={2}>红红火火恍恍惚惚哈哈哈哈哈哈哈哈哈哈哈哈</TextEllipsis>

      <Modal open={isOpen} onCancel={() => setIsOpen(false)}>
        modal-content
      </Modal>
    </div>
  )
}
