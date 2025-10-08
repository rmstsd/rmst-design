import { useClick, useDismiss, useFloating, useInteractions, useMergeRefs } from '@floating-ui/react'
import { useEffect, useEffectEvent, useId, useLayoutEffect, useRef, useState } from 'react'
import { Button, Portal } from 'rmst-design'
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

function AHome() {
  return (
    <div>
      <hr />
      <button
        onClick={() => {
          const aaTarget = document.querySelector('#aaTarget') as HTMLDivElement

          const ani = aaTarget.animate({ left: '50px' }, { duration: 1000, fill: 'forwards' })

          setTimeout(() => {
            ani.pause()

            aaTarget.animate({ left: '100px' }, { duration: 1000, fill: 'forwards' })
          }, 500)
        }}
      >
        执行
      </button>
      <hr />

      <div className="w-40 h-40 bg-gray-300 absolute bottom-10 left-10" id="aaTarget"></div>
      <div className="w-40 h-40 bg-gray-500 absolute bottom-40 " style={{ left: 100 }} id="aaTarget"></div>

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
}

const toPx = (value: number) => {
  return `${value}px`
}

export default function AHomePage() {
  const [count, setCount] = useState(0)

  const handleClick = useEffectEvent(() => {
    console.log(count)
  })

  useEffect(() => {
    console.log('handleClick 变化了')
  }, [handleClick])

  useEffect(() => {
    setInterval(() => {
      handleClick()
    }, 1000)
  }, [])

  return (
    <div>
      <Button onClick={() => setCount(count + 1)}>count: {count}</Button>
    </div>
  )
}
