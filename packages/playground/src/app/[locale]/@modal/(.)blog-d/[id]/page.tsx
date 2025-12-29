'use client'

import { blogList } from '@/db'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { Modal } from 'rmst-design'

export default function Page(props) {
  const { id } = use(props.params) as { id: string }
  const router = useRouter()

  const data = blogList.find(item => item.id === id) ?? {}

  return (
    <Modal open onCancel={() => router.back()}>
      <div className="modal bg-amber-100">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </Modal>
  )
}
