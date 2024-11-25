import './style.less'

import dayjs from 'dayjs'

type SelectProps = {}

export function Select(props: SelectProps) {
  const today = dayjs()
  console.log(today.date(1).day())
  const week = today.date(1).day()

  const days = Array.from({ length: 42 }, () => '')
  // console.log(days)

  days[week] = today.date(1).format('YYYY-MM-DD')
  console.log(days)

  days.forEach((row, rowIndex) => {
  })

  return <div className="select">select发发发</div>
}
