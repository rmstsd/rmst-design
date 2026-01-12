import { Suspense } from 'react'
import PageClient from './page-client'

export default function Page(props) {
  return (
    // for 'useSearchParams'
    <Suspense>
      <PageClient />
    </Suspense>
  )
}
