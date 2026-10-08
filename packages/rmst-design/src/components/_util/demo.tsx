import { startTransition, useEffect, useState, ViewTransition } from 'react'

const duration = 200
const easing = 'ease'

export const Demo = function () {
  const [open, setOpen] = useState(false)
  const [isRendered, setIsRendered] = useState(open)

  useEffect(() => {
    startTransition(() => setIsRendered(open))
  }, [open])

  return (
    <>
      <button
        onClick={() =>
          startTransition(() => {
            setOpen(!open)
          })
        }
      >
        set open
      </button>

      <ViewTransition>
        {isRendered && (
          <div className="wrapper">
            <ViewTransition
              onEnter={instance => {
                const animation = instance.new.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing })
                return () => animation.cancel()
              }}
              onExit={instance => {
                const animation = instance.old.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing })
                return () => animation.cancel()
              }}
            >
              <div className="mask"></div>
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
                return () => animation.cancel()
              }}
            >
              <div className="content">content</div>
            </ViewTransition>
          </div>
        )}
      </ViewTransition>
    </>
  )
}
