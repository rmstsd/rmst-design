import { startTransition, useCallback, useEffect, useEffectEvent, useLayoutEffect, useRef, useState, ViewTransition } from 'react'

const duration = 200
const easing = 'ease'

function useViewTransitionPresence(open: boolean) {
  const [isRendered, setIsRendered] = useState(open)
  const [isVisible, setIsVisible] = useState(open)
  const openRef = useRef(open)

  useLayoutEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    if (open) {
      if (!isRendered) {
        setIsRendered(true)
        return
      }

      startTransition(() => setIsVisible(true))
      return
    }

    startTransition(() => setIsVisible(false))
  }, [open, isRendered])

  const handleExitComplete = useCallback(() => {
    if (!openRef.current) {
      setIsRendered(false)
    }
  }, [])

  return { isRendered, isVisible, handleExitComplete }
}

export const Demo = function () {
  const [open, setOpen] = useState(false)
  const { isRendered, isVisible, handleExitComplete } = useViewTransitionPresence(open)

  return (
    <>
      <button onClick={() => setOpen(value => !value)}>set open</button>

      {isRendered && (
        <div className="wrapper">
          {isVisible && (
            <>
              <ViewTransition
                onEnter={instance => {
                  const animation = instance.new.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing })
                  return () => animation.cancel()
                }}
                onExit={instance => {
                  const animation = instance.old.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing })
                  return () => {
                    animation.cancel()
                  }
                }}
              >
                <div
                  style={{ zIndex: 1000 }}
                  className="mask"
                  onClick={() => {
                    setOpen(false)
                  }}
                ></div>
              </ViewTransition>
              <ViewTransition
                onEnter={instance => {
                  const animation = instance.new.animate(
                    [
                      { opacity: 0, transform: 'translateY(24px)' },
                      { opacity: 1, transform: 'translateY(0)' }
                    ],
                    { duration, easing }
                  )
                  return () => animation.cancel()
                }}
                onExit={instance => {
                  const animation = instance.old.animate(
                    [
                      { opacity: 1, transform: 'translateY(0)' },
                      { opacity: 0, transform: 'translateY(24px)' }
                    ],
                    { duration, easing }
                  )
                  return () => {
                    animation.cancel()
                    handleExitComplete()
                  }
                }}
              >
                <div className="content">content</div>
              </ViewTransition>
            </>
          )}
        </div>
      )}
    </>
  )
}
