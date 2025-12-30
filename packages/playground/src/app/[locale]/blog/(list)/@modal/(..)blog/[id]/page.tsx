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
    <div className="Modal-plc">
      <Modal
        open
        onCancel={() => {
          //  router.back()
          router.push('/blog') // 需要创建 @modal/page.tsx
          // router.push('/ahome')
        }}
      >
        <div className="modal bg-amber-100">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </Modal>
    </div>
  )
}
