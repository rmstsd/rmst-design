import { Trigger } from '../Trigger'

import dayjs, { Dayjs } from 'dayjs'

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DatePicker(props: DatePickerProps) {
  const content = <div>DatePicker</div>

  return (
    <Trigger popup={content}>
      <div
        onClick={() => {
          console.log('div click')
        }}
      >
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
