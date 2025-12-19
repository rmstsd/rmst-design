'use server'

import { Side_Open_Key } from '@/app/[locale]/components/constant'
import { cookies } from 'next/headers'

export async function updateSideOpen(data) {
  console.log('data', data)

  const ck = await cookies()

  ck.set(Side_Open_Key, data.sideOpen)
}
