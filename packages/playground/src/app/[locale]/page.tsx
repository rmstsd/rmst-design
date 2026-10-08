'use client'

import { startTransition, useState } from 'react'
import { ViewTransition } from 'react'
import { ClaudeSort } from './z-page/claude-sort'
import { DragSortMy } from './z-page/drag-sort-my'

import './page.scss'

export default function page() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* <DragSortFlip /> */}

      {/* <DragSortMy /> */}

      {/* <ClaudeSort /> */}

      <div className="visibility-demo">
        <button
          className="visibility-demo__button"
          onClick={() =>
            startTransition(() => {
              setIsVisible(value => !value)
            })
          }
        >
          {isVisible ? '隐藏内容' : '显示内容'}
        </button>

        <div className="visibility-demo__animated">
          {isVisible && (
            <ViewTransition
              onEnter={instance => {
                const animation = instance.new.animate(
                  [
                    { opacity: 0, transform: 'translateX(8px)' },
                    { opacity: 1, transform: 'translateX(0)' }
                  ],
                  { duration: 220, easing: 'ease', fill: 'both' }
                )

                return () => animation.cancel()
              }}
              onExit={instance => {
                const animation = instance.old.animate(
                  [
                    { opacity: 1, transform: 'translateX(0)' },
                    { opacity: 0, transform: 'translateX(8px)' }
                  ],
                  { duration: 220, easing: 'ease', fill: 'both' }
                )

                return () => animation.cancel()
              }}
            >
              <div className="visibility-demo__content">点击按钮切换显示</div>
            </ViewTransition>
          )}

          <ViewTransition>
            <div>123</div>
            <div>456</div>
          </ViewTransition>
        </div>
      </div>
    </div>
  )
}
