import { blogList } from '@/db'
import { Link } from '@/i18n/navigation'

export default function Page() {
  return (
    <div className="p-3">
      {blogList.map(item => (
        <div key={item.id} className="mb-3">
          <Link href={`/blog-d/${item.id}`}>{item.title}</Link>

          <p className="text-gray-500">{item.content}</p>
        </div>
      ))}
    </div>
  )
}
