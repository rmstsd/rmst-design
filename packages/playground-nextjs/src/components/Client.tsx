'use client'

import { PropsWithChildren } from 'react'

export default function ClientWrapper(props: PropsWithChildren) {
  return props.children
}
