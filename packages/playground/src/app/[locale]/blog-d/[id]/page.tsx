import { blogList } from '@/db'
import { use } from 'react'

export default function Page(props) {
  const { id } = use(props.params) as { id: string }

  const data = blogList.find(item => item.id === id) ?? {}

  return (
    <div className="blog-d bg-pink-200">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
