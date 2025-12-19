import { PropsWithChildren, use } from 'react'

import LayoutContent from './layoutContent'
import { cookies } from 'next/headers'
import { Side_Open_Key } from './constant'

export default function Layout(props: PropsWithChildren) {
  const cookieStore = use(cookies())
  const val = cookieStore.get(Side_Open_Key)
  console.log('server', val)

  return <LayoutContent {...props} sideOpen={val?.value} />
}
