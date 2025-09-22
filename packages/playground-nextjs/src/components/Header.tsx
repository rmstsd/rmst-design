import { Link } from '@/i18n/navigation'
import { SelectTheme } from './Theme'

export const headerHeight = 48

export default function Header() {
  return (
    <header
      className="site-header border-b flex items-center px-2 fixed top-0 w-full z-10 gap-2"
      style={{ height: headerHeight }}
    >
      <Link href="/">首页</Link>

      <Link href="/components/Button">组件</Link>

      <Link href="/ahome">ahome</Link>
      <Link href="/blog">blog</Link>

      <SelectTheme />
    </header>
  )
}
