import { useClick, useDismiss, useFloating, useInteractions, useMergeRefs } from '@floating-ui/react'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Portal } from 'rmst-design'
import Tooltip from './Tooltip/Tooltip'

import './style.less'

const useMyFloating = (isOpen, setIsOpen) => {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    transform: false
  })

  const click = useClick(context, { event: 'click' })
  const dismiss = useDismiss(context, { outsidePressEvent: 'click' })
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  return { refs, floatingStyles, getReferenceProps, getFloatingProps }
}

const options: KeyframeAnimationOptions = { duration: 3000, fill: 'forwards', easing: 'ease' }

export default function AHome() {
  const tip1 = useRef<HTMLDivElement>(null)
  const tip2 = useRef<HTMLDivElement>(null)

  const [isOpen1, setIsOpen1] = useState(false)
  const myFloating1 = useMyFloating(isOpen1, setIsOpen1)
  const dom_1 = useRef<HTMLDivElement>(null)
  const ref_1 = useMergeRefs([dom_1, myFloating1.refs.setFloating])

  const [isOpen2, setIsOpen2] = useState(false)
  const myFloating2 = useMyFloating(isOpen2, setIsOpen2)
  const dom_2 = useRef<HTMLDivElement>(null)
  const ref_2 = useMergeRefs([dom_2, myFloating2.refs.setFloating])

  const [hasAnimated, setHasAnimated] = useState(false)

  const isOpen_Ans = isOpen1 || hasAnimated
  const isOpen2_Ans = isOpen2 || hasAnimated

  useLayoutEffect(() => {
    if (isOpen2) {
      setHasAnimated(true)

      requestAnimationFrame(() => {
        console.log(dom_1.current, dom_2.current)

        let f = dom_1.current.getBoundingClientRect()
        let l = dom_2.current.getBoundingClientRect()

        const ani = dom_1.current.animate(
          [
            { left: toPx(f.left), top: toPx(f.top), width: toPx(f.width), height: toPx(f.height), opacity: 1 },
            { left: toPx(l.left), top: toPx(l.top), width: toPx(l.width), height: toPx(l.height), opacity: 0 }
          ],
          options
        )

        const kfs = [
          { left: toPx(f.left), top: toPx(f.top), width: toPx(f.width), height: toPx(f.height), opacity: 0 },
          { left: toPx(l.left), top: toPx(l.top), width: toPx(l.width), height: toPx(l.height), opacity: 1 }
        ]

        dom_2.current.animate(kfs, options)

        ani.onfinish = () => {
          setHasAnimated(false)
        }
      })
    }
  }, [isOpen2_Ans])

  return (
    <div>
      <hr />
      <button
        onClick={() => {
          const aaTarget = document.querySelector('#aaTarget') as HTMLDivElement

          const ani = aaTarget.animate([{ width: '30px', height: '30px' }], { duration: 1000, fill: 'forwards' })

          setTimeout(() => {
            ani.cancel()
          }, 500)

          ani.onfinish = () => {
            console.log('ff')
          }
        }}
      >
        执行
      </button>
      <hr />

      <div className="w-40 h-40 bg-gray-300" id="aaTarget"></div>

      <div className="flex justify-evenly">
        <>
          <Tooltip name="A" content={<div className="bg-white p-4 border ">content A</div>}>
            <button>A</button>
          </Tooltip>
          <Tooltip
            name="B"
            content={
              <div className="bg-pink-100 h-full p-4 border ">
                <div>content BBBBBBBBBBBBBBBBBB</div>
                <div>content BBBBBBBBBBBBBBBBBB</div>
                <div>content BBBBBBBBBBBBBBBBBB</div>
              </div>
            }
          >
            <button>B</button>
          </Tooltip>
          <Tooltip
            name="C"
            content={
              <div className="bg-white p-4 border">
                <div>content CCC</div>
                <div>content CCCCCC</div>
                <div>content CCC</div>
                <div>content CCC</div>
                <div>content CCC</div>
              </div>
            }
          >
            <button>C</button>
          </Tooltip>
          <Tooltip
            name="D"
            content={
              <div className="bg-white p-4 border">
                <div>content DD</div>
                <div>content DDD</div>
              </div>
            }
          >
            <button>D</button>
          </Tooltip>
        </>
      </div>
    </div>
  )

  return (
    <div>
      <hr />

      <div>
        <div ref={tip1} className="tooltip-1 w-60 h-60 bg-gray-200 absolute left-10 top-[400px]">
          tip 1
        </div>
        <div ref={tip2} className="tooltip-2 w-96 h-96 bg-pink-200 absolute left-10 top-[500px]">
          tip 2
        </div>

        <div className="flex justify-evenly">
          <button ref={myFloating1.refs.setReference} {...myFloating1.getReferenceProps()}>
            q
          </button>
          <button ref={myFloating2.refs.setReference} {...myFloating2.getReferenceProps()}>
            w
          </button>
        </div>

        <>
          {isOpen_Ans && (
            <Portal>
              <div
                ref={ref_1}
                {...myFloating1.getFloatingProps()}
                style={{
                  ...myFloating1.floatingStyles,
                  overflowY: 'auto',
                  background: '#eee',
                  width: 100,
                  borderRadius: 8,
                  outline: 0
                }}
              >
                content Q
              </div>
            </Portal>
          )}

          {isOpen2_Ans && (
            <Portal>
              <div
                ref={ref_2}
                {...myFloating2.getFloatingProps()}
                style={{
                  ...myFloating2.floatingStyles,
                  background: 'pink',
                  width: 120,
                  height: 50,
                  borderRadius: 111,
                  outline: 0,
                  padding: 10
                }}
              >
                content W
              </div>
            </Portal>
          )}
        </>
      </div>
    </div>
  )
}

const toPx = (value: number) => {
  return `${value}px`
}
