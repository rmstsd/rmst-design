import { use, useRef, useState, useEffect } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'
import { Trigger } from '../Trigger'

import dayjs, { Dayjs } from 'dayjs'
import { useControllableValue, useInteract } from '../_util/hooks'
import clsx from 'clsx'

import './style.less'
import { IconWrapper } from '../IconWrapper'
import { Calendar, X } from 'lucide-react'
import moment from 'moment'
import { Input } from '../Input'
import TimeInput from './panels/time-panel'
import PickerPanel from './panels/date-panel'
import { Button } from '../Button'
import { DayPoint } from './date-utils'

export type Mode = 'date' | 'month' | 'year'

interface DatePickerProps extends InteractProps {
  placeholder?: string
  format?: string
  timePart?: boolean
  value?: string
  onChange?: (value: string) => void
  className?: string
  style?: React.CSSProperties
}

export function DatePicker(props: DatePickerProps) {
  const { size, readOnly, disabled, placeholder, format, timePart, className, style } = props
  const { prefixCls, size: ctxSize } = use(ConfigContext)

  const merSize = size ?? ctxSize
  const [value, onChange] = useControllableValue({ ...props })

  const selectPrefixCls = `${prefixCls}-picker`
  const interact = useInteract(selectPrefixCls, { size: merSize, readOnly, disabled })
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [ymd, setYmd] = useState('')

  const [valueMm, setValueMm] = useState<moment.Moment>()
  const [mode, setMode] = useState<Mode>('date')

  useEffect(() => {
    const m = value ? moment(value) : null
    const format = props.format || (timePart ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')

    setValueMm(value ? moment(value).milliseconds(0) : undefined)

    setYmd(m?.format(format) || '')
  }, [value])

  function selectDay(col: DayPoint) {
    const m = valueMm ? valueMm.clone() : moment().hour(0).minute(0).second(0)
    m.year(col.y).month(col.m).date(col.d).milliseconds(0)
    setValueMm(m)

    if (!timePart) {
      onChange(m.toISOString())
    }
  }

  const onCurrentTimeClick = () => {
    const m = moment().milliseconds(0)
    setValueMm(m)
    onChange(m.toISOString())
  }

  const onFooterConfirmClick = () => {
    if (onChange && valueMm) {
      onChange(valueMm.toISOString())
    }

    setVisible(false)
  }

  const timeHeader = (
    <header className="input-date-header">
      <Input value={valueMm?.format('YYYY-MM-DD')} />
      <TimeInput valueMm={valueMm} setValueMm={setValueMm} />
    </header>
  )

  const footer = (
    <footer className="input-date-footer">
      {timePart && (
        <Button onClick={onCurrentTimeClick} type="text" size="small">
          当前时刻
        </Button>
      )}
      <Button onClick={onFooterConfirmClick} size="small">
        确认
      </Button>
    </footer>
  )

  const content = (
    <div className="rui-input-date-popup" onClick={evt => evt.stopPropagation()}>
      {timePart && timeHeader}
      <PickerPanel mode={mode} setMode={setMode} valueMm={valueMm} selectDay={selectDay} />
      {mode === 'date' && footer}
    </div>
  )

  return (
    <Trigger
      popup={content}
      trigger="focus"
      value={visible}
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
      onExited={() => {
        setMode('date')
      }}
    >
      <div
        className={clsx(interact.cls, className)}
        style={style}
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
        <input
          ref={inputRef}
          readOnly={readOnly}
          placeholder={placeholder}
          disabled={disabled}
          value={ymd}
          onChange={evt => onChange(evt.target.value)}
        />

        <span className="suffix">
          {value && !interact.isDisabledOrReadonly ? (
            <IconWrapper className="clear" onClick={() => onChange('')} onPointerDown={evt => evt.preventDefault()}>
              <X />
            </IconWrapper>
          ) : null}
          <Calendar className="picker-icon" />
        </span>
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
