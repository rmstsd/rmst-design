import { blogList } from '@/db'
import { Link } from '@/i18n/navigation'

export default function Page() {
  console.log('Page render')
  return (
    <div className="blog p-3">
      {blogList.map(item => (
        <div key={item.id} className="mb-3">
          <Link href={`/blog/${item.id}`}>{item.title}</Link>

          <p className="text-gray-500">{item.content}</p>
        </div>
      ))}
    </div>
  )
}
