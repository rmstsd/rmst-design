import { use, useRef, useState } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import { Trigger } from '../Trigger'

import dayjs, { Dayjs } from 'dayjs'
import { useInteract } from '../_util/hooks'
import clsx from 'clsx'

import './style.less'

interface DatePickerProps extends InteractProps {
  placeholder?: string
}

export function DatePicker(props: DatePickerProps) {
  const { size, readOnly, disabled, placeholder } = props
  const { prefixCls, size: ctxSize } = use(ConfigContext)

  const merSize = size ?? ctxSize

  const selectPrefixCls = `${prefixCls}-select`
  const interact = useInteract(selectPrefixCls, { size: merSize, readOnly, disabled })
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const content = <div>DatePicker</div>

  return (
    <Trigger
      popup={content}
      trigger="focus"
      value={visible}
      autoAlignPopupWidth
      disabled={interact.isDisabledOrReadonly}
      onChange={visible => {
        if (interact.isDisabledOrReadonly) {
          return
        }

        setVisible(visible)
        if (visible === false) {
          interact.setIsFocused(false)
        }
      }}
    >
      <div
        className={clsx(interact.cls)}
        onPointerDown={evt => {
          requestAnimationFrame(() => {
            inputRef.current.focus()
          })
        }}
        tabIndex={disabled ? undefined : -1}
        onFocus={() => {
          interact.setIsFocused(true)
        }}
        onBlur={() => {
          interact.setIsFocused(false)
        }}
      >
        <input ref={inputRef} readOnly={readOnly} placeholder={placeholder} disabled={disabled} />
      </div>
    </Trigger>
  )
}

function getDateListByDy(dy: Dayjs) {
  const today = dy
  const week = today.date(1).day()
  const days = Array.from({ length: 42 }, () => '')
  const index = week === 0 ? 6 : week - 1

  days[index] = today.date(1).format('YYYY-MM-DD')

  for (let i = 0; i < index; i++) {
    days[i] = today.date(-index + 1 + i).format('YYYY-MM-DD')
  }

  for (let i = index; i < days.length; i++) {
    days[i] = today.date(i - index + 1).format('YYYY-MM-DD')
  }

  const ans = days.reduce((acc, cur, index) => {
    if (index % 7 === 0) {
      acc.push([cur])
    } else {
      acc[acc.length - 1].push(cur)
    }

    return acc
  }, [])

  return ans
}

// console.log(getDateListByDy(dayjs()))
