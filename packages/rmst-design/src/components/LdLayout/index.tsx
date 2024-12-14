import './style.less'
import { config } from './config'
import { Item } from './Item'

const useDrag = () => {
  const onPointerDown = (evt: React.PointerEvent) => {
    const target = evt.target as HTMLElement

    console.log(target.closest('[data-component]'))
  }

  return onPointerDown
}

export function LdLayout() {
  const onPointerDown = useDrag()

  return (
    <div className="rt-ld-layout" onPointerDown={onPointerDown}>
      <Item config={config} />
    </div>
  )
}
