import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const handleI18nRouting = createMiddleware(routing)

// not locale
const notLocale = ['/nl', '/spa']

export default async function proxy(request: NextRequest) {
  const { nextUrl } = request

  if (notLocale.some(item => nextUrl.pathname.startsWith(item))) {
  } else {
    let response = handleI18nRouting(request)
    return response
  }
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}
