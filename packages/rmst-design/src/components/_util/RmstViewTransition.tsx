import { PropsWithChildren, startTransition, useLayoutEffect, useState, ViewTransition } from 'react'

type RmstViewTransitionProps = PropsWithChildren<{
  open: boolean
  keyframes: Keyframe[]
  onEnter?: () => void
  onExited?: () => void
}>
const kfOptions: KeyframeAnimationOptions = {
  duration: 200,
  easing: 'ease'
}

export const RmstViewTransition = (props: RmstViewTransitionProps) => {
  const { children, open, keyframes, onExited, onEnter } = props

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
          onEnter?.()
          const animation = instance.new.animate(keyframes, kfOptions)

          return () => {
            animation.cancel()
          }
        }}
        onExit={instance => {
          const animation = instance.old.animate(keyframes.toReversed(), kfOptions)

          return () => {
            onExited?.()
            animation.cancel()
          }
        }}
      >
        {children}
      </ViewTransition>
    )
  )
}
