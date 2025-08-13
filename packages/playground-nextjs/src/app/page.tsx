import { Button, Input, Modal, TextEllipsis } from 'rmst-design'

export default function Home() {
  return (
    <div className="p-4">
      <Button>aaa</Button>
      <Input />
      <TextEllipsis rows={2}>
        阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖
        阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖
        阿是时间过得覆盖 阿是时间过得覆盖 阿是时间过得覆盖
      </TextEllipsis>

      <Modal open={true}>modal-content</Modal>
    </div>
  )
}
