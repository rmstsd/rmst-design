'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { SelectTheme } from './Theme'

export const headerHeight = 48

export default function Header() {
  const pathname = usePathname()

  const [rootPathSegment] = pathname.split('/').filter(Boolean)

  return (
    <header
      className="site-header border-b border-gray-200 flex items-center px-2 fixed top-0 w-full z-10 gap-2"
      style={{ height: headerHeight }}
    >
      <Link href="/" className={pathname === '/' ? 'header-link-active' : ''}>
        首页
      </Link>

      <Link href="/components/LdLayout" className={pathname.startsWith('/components/') ? 'header-link-active' : ''}>
        组件
      </Link>

      <Link href="/ahome" className={rootPathSegment === 'ahome' ? 'header-link-active' : ''}>
        ahome
      </Link>

      <Link href="/blog" className={rootPathSegment === 'blog' ? 'header-link-active' : ''}>
        blog
      </Link>
      <Link href="/blog-2" className={rootPathSegment === 'blog-2' ? 'header-link-active' : ''}>
        blog-2
      </Link>

      <SelectTheme />
    </header>
  )
}
