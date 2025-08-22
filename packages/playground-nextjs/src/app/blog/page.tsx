import { Modal } from 'rmst-design'
import Client from './Client'

export default function Blog() {
  console.log('test render')

  const p = fetch('http://localhost:1400/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delay: 10, name: '接口' })
  }).then(res => res.json())

  return (
    <div className="">
      <div>blog</div>

      <Client p={p} />

      <Modal>
        <div>Modal content</div>
      </Modal>
    </div>
  )
}
