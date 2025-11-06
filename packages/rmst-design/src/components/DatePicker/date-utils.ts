import moment from 'moment'
import { Hms } from './panels/time-panel'
import { clamp } from 'es-toolkit'

export const WEEK_DAYS_CN: () => string[] = () => ['一', '二', '三', '四', '五', '六', '日']

const MonthMap: Record<string, string> = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
}

export const MONTHS_CN = (today: moment.Moment) => {
  const currentMonth = today.month() + 1

  const months = Object.keys(MonthMap).map((item, index) => ({
    isCurrentMonth: parseInt(item) === currentMonth,
    name: item,
    month: index
  }))

  return months
}
export type Years = ReturnType<typeof genYears>
export const genYears = (year: number) => {
  const startYear = Math.floor(year / 10) * 10 - 1

  const years = Array.from({ length: 12 }).map((_, index) => ({
    name: startYear + index,
    isPrev: index === 0,
    isNext: index === 11,
    currentYear: startYear + index === moment().year()
  }))

  return years
}

export interface DayPoint {
  y: number
  m: number
  d: number
  c: string
}

export function genDays(year: number, month: number): DayPoint[][] {
  const todayM = moment()
  const todayYear = todayM.year()
  const todayMonth = todayM.month()
  const todayDay = todayM.date()

  const firstDayOfMonth = year > 0 && month >= 0 ? moment({ y: year, M: month, d: 1 }) : moment()
  year = firstDayOfMonth.year()
  month = firstDayOfMonth.month()

  let firstWeekDay = firstDayOfMonth.day()
  if (firstWeekDay === 0) firstWeekDay = 7 // Sunday 从前改到后
  const lastMonthRestDays = firstWeekDay - 1 // 上一个月在表格中显示几个

  const points: DayPoint[] = []

  if (lastMonthRestDays) {
    const lastMonthM = firstDayOfMonth.clone().subtract(1, 'months')
    const lmY = lastMonthM.year(),
      lmM = lastMonthM.month()
    const lastMonthLastDate = lastMonthM.endOf('month').date()
    for (let i = 1; i <= lastMonthRestDays; i++) {
      points.push({ y: lmY, m: lmM, d: lastMonthLastDate - (lastMonthRestDays - i), c: 'last-month' })
    }
  }

  const daysInThisMonth = firstDayOfMonth.daysInMonth()
  for (let i = 1; i <= daysInThisMonth; i++) {
    const todayCls = todayYear === year && todayMonth === month && todayDay === i ? 'today' : ''
    points.push({ y: year, m: month, d: i, c: 'this-month ' + todayCls })
  }

  let extraAdded = 0
  if (points.length / 7 === 5) {
    extraAdded = 0
  } else if (Math.ceil(points.length / 7) === 5) {
    extraAdded = 7
  }

  const nextMonthAheadDays = 7 - ((lastMonthRestDays + daysInThisMonth) % 7) + extraAdded
  const nextMonthM = firstDayOfMonth.clone().add(1, 'months')
  const nmY = nextMonthM.year(),
    nmM = nextMonthM.month()
  for (let i = 1; i <= nextMonthAheadDays; i++) {
    points.push({ y: nmY, m: nmM, d: i, c: 'next-month' })
  }

  const p2: DayPoint[][] = []
  const rows = points.length / 7
  for (let i = 0; i < rows; i++) {
    p2.push(points.slice(i * 7, (i + 1) * 7))
  }
  return p2
}

export const genTimeList = (length: number) => Array.from({ length }, (_, i) => i)

export const padStartZero = (n: number) => {
  return n.toString().padStart(2, '0')
}

export const parseHmsByString = (str: string) => {
  const [h, m, s] = str.split(':')

  let hour = parseInt(h)
  let minute = parseInt(m)
  let second = parseInt(s)

  hour = clamp(hour, 0, 23)
  minute = clamp(minute, 0, 59)
  second = clamp(second, 0, 59)

  if (Number.isNaN(hour)) {
    hour = 0
  }
  if (Number.isNaN(minute)) {
    minute = 0
  }
  if (Number.isNaN(second)) {
    second = 0
  }

  return { hour, minute, second }
}

export const getInputValueByHms = (hms: Hms) => {
  return `${padStartZero(hms.hour)}:${padStartZero(hms.minute)}:${padStartZero(hms.second)}`
}
