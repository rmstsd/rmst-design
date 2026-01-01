import Link from 'next/link'

export default function page() {
  return (
    <div>
      <h1>List</h1>

      <Link href="/blog-2/photo/123" className="text-blue-500">
        Photo 123
      </Link>
    </div>
  )
}
