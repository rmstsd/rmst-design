import { useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react'
import { cloneElement, createContext, PropsWithChildren, ReactNode, use, useId, useLayoutEffect, useRef, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { Portal } from 'rmst-design'
import { useAnTransition } from '../../../../../rmst-design/src/components/_util/hooks'
import { useLatest } from 'ahooks'

interface Props extends PropsWithChildren {
  name?: string
  content?: ReactNode
}

const Context = createContext({})

const options: KeyframeAnimationOptions = { duration: 500, fill: 'forwards', easing: 'ease' }

export const TooltipProvider = (props: PropsWithChildren) => {
  const [mapOpen, setMapOpen] = useState({})
  const [state, setState] = useState({ openName: '' })

  const stateRef = useLatest(state)

  const floatingMapRef = useRef<Record<string, HTMLDivElement>>({})

  const setFloatingDom = (name: string, dom: HTMLDivElement) => {
    floatingMapRef.current[name] = dom
  }

  useLayoutEffect(() => {
    // mapOpen 有两个为 true 的时候
    if (Object.values(mapOpen).filter(item => item).length === 2) {
      const keys = Object.keys(mapOpen).filter(k => mapOpen[k])

      const openName = stateRef.current.openName

      const prevName = keys.find(k => k !== openName)
      console.log(prevName, openName)

      const f_dom = floatingMapRef.current[prevName]
      const l_dom = floatingMapRef.current[openName]

      console.log(f_dom)
      console.log(l_dom)

      // 等 openName 的 dom 渲染完成, 位置计算完成
      requestAnimationFrame(() => {
        let f = f_dom.getBoundingClientRect()
        let l = l_dom.getBoundingClientRect()
        console.log(f)
        console.log(l)

        f_dom.style.setProperty('overflow', 'hidden')
        f_dom.style.setProperty('white-space', 'nowrap')
        const f_ani = f_dom.animate(
          [
            { left: toPx(f.left), top: toPx(f.top), width: toPx(f.width), height: toPx(f.height), opacity: 1 },
            { left: toPx(l.left), top: toPx(l.top), width: toPx(l.width), height: toPx(l.height), opacity: 0 }
          ],
          options
        )
        f_ani.onfinish = () => {
          f_dom.style.setProperty('overflow', '')
          f_dom.style.setProperty('white-space', '')
        }

        l_dom.style.setProperty('overflow', 'hidden')
        l_dom.style.setProperty('white-space', 'nowrap')
        const l_ani = l_dom.animate(
          [
            { left: toPx(f.left), top: toPx(f.top), width: toPx(f.width), height: toPx(f.height), opacity: 0 },
            { left: toPx(l.left), top: toPx(l.top), width: toPx(l.width), height: toPx(l.height), opacity: 1 }
          ],
          options
        )
        l_ani.onfinish = () => {
          l_dom.style.setProperty('overflow', '')
          l_dom.style.setProperty('white-space', '')

          setMapOpen({ ...mapOpen, [prevName]: false })
        }
      })
    }
  }, [mapOpen])

  return <Context value={{ mapOpen, setMapOpen, state, setState, setFloatingDom }}>{props.children}</Context>
}

export default function Tooltip(props: Props) {
  const { name, children, content } = props

  // const [isOpen, setIsOpen] = useState(false)

  const { mapOpen, setMapOpen, state, setState, setFloatingDom } = use(Context)
  const isOpen = mapOpen[name] ?? false
  const setIsOpen = (isOpen: boolean) => {
    setMapOpen({ ...mapOpen, [name]: isOpen })

    setState({ ...state, openName: name })
  }

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    transform: false
  })

  const click = useClick(context, { event: 'click' })
  const dismiss = useDismiss(context, { outsidePress: false, outsidePressEvent: 'click' })
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  const referenceProps = getReferenceProps()
  const childElement = cloneElement(children as any, {
    ref: mergeRefs([refs.setReference]),
    ...referenceProps
  })

  const { shouldMount, setDomRef } = useAnTransition({
    open: isOpen,
    keyframes: [
      { transform: 'translateY(10px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ],
    keyframesOut: [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(-10px)', opacity: 0 }
    ]
  })

  return (
    <>
      {childElement}

      {isOpen && (
        <Portal>
          <div
            ref={mergeRefs([refs.setFloating, dom => setFloatingDom(name, dom), setDomRef])}
            {...getFloatingProps()}
            className="shadow-xl"
            style={{ ...floatingStyles, borderRadius: 8 }}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  )
}

const toPx = (value: number) => {
  return `${value}px`
}
