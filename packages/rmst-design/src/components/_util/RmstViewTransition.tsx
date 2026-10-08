import { PropsWithChildren, startTransition, useLayoutEffect, useState, ViewTransition } from 'react'

type RmstViewTransitionProps = PropsWithChildren<{
  open: boolean
  keyframes?: Keyframe[]
  enterKeyframes?: Keyframe[]
  exitKeyframes?: Keyframe[]
  duration?: number
}>

export const RmstViewTransition = (props: RmstViewTransitionProps) => {
  const { children, open, keyframes, enterKeyframes = keyframes ?? [], exitKeyframes = keyframes?.toReversed() ?? [], duration = 200 } = props

  const [isVisible, setIsVisible] = useState(open)

  useLayoutEffect(() => {
    startTransition(() => {
      setIsVisible(open)
    })
  }, [open])

  return (
    <ViewTransition
      onEnter={instance => {
        const animation = instance.new.animate(enterKeyframes, { duration, easing: 'ease' })

        return () => animation.cancel()
      }}
      onExit={instance => {
        const animation = instance.old.animate(exitKeyframes, { duration, easing: 'ease' })

        return () => animation.cancel()
      }}
    >
      {isVisible ? children : null}
    </ViewTransition>
  )
}
