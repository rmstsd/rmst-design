import { PropsWithChildren, startTransition, useLayoutEffect, useState, ViewTransition } from 'react'

type RmstViewTransitionProps = PropsWithChildren<{
  open: boolean
  keyframes: Keyframe[]
  onExited?: () => void
}>
const kfOptions: KeyframeAnimationOptions = {
  duration: 200,
  easing: 'ease'
}

export const RmstViewTransition = (props: RmstViewTransitionProps) => {
  const { children, open, keyframes, onExited } = props

  const [isVisible, setIsVisible] = useState(open)

  useLayoutEffect(() => {
    startTransition(() => {
      setIsVisible(open)
    })
  }, [open])

  return (
    isVisible && (
      <ViewTransition
        onEnter={instance => {
          const animation = instance.new.animate(keyframes, kfOptions)

          return () => animation.cancel()
        }}
        onExit={instance => {
          const animation = instance.old.animate(keyframes.toReversed(), kfOptions)

          return () => {
            animation.cancel()
            onExited?.()
          }
        }}
      >
        {children}
      </ViewTransition>
    )
  )
}
