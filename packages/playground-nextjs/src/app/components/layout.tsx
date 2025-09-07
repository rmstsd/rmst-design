import Side from '@/components/Side'
import { PropsWithChildren } from 'react'

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex">
      <div className="w-[160px] shrink-0">
        <Side />
      </div>

      <section className="p-2 flex-grow">{props.children}</section>
    </div>
  )
}
