import { use } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import { Trigger } from '../Trigger'

import dayjs, { Dayjs } from 'dayjs'
import { useInteract } from '../_util/hooks'
import clsx from 'clsx'

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement>, InteractProps {}

export function DatePicker(props: DatePickerProps) {
  const { size, readOnly, disabled } = props
  const { prefixCls, size: ctxSize } = use(ConfigContext)

  const merSize = size ?? ctxSize

  const selectPrefixCls = `${prefixCls}-select`
  const interact = useInteract(selectPrefixCls, { size: merSize, readOnly, disabled })

  const content = <div>DatePicker</div>

  return (
    <Trigger popup={content}>
      <div className={clsx(interact.cls)}>
        <input type="text" />
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

console.log(getDateListByDy(dayjs()))
