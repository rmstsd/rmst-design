import classNames from 'clsx'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { genTimeList, getInputValueByHms, padStartZero, parseHmsByString } from '../date-utils'
import scrollIntoView from 'scroll-into-view-if-needed'
import moment from 'moment'
import { Input } from '../../Input'
import { Button } from '../../Button'
import { Trigger } from '../../Trigger'
import { Scrollbar } from '../../Scrollbar'

interface TimeInputProps {
  valueMm: moment.Moment | undefined
  setValueMm: (value: moment.Moment) => void
}
export default function TimeInput({ valueMm, setValueMm }: TimeInputProps) {
  const [hms, setHms] = useState<Hms>(() => {
    if (valueMm) {
      return { hour: valueMm.hour(), minute: valueMm.minute(), second: valueMm.second() }
    }

    return { hour: 0, minute: 0, second: 0 }
  })
  const [isShowTimePanel, setIsShowTimePanel] = useState(false)

  const onHeaderTimeClick = () => {
    if (!valueMm) {
      setValueMm(moment().hour(0).minute(0).second(0).milliseconds(0))
    }
    setIsShowTimePanel(true)
  }

  return (
    <Trigger
      value={isShowTimePanel}
      onChange={setIsShowTimePanel}
      popup={
        <TimePanel
          hms={hms}
          onCancel={() => {
            setHms({ hour: valueMm?.hour() ?? 0, minute: valueMm?.minute() ?? 0, second: valueMm?.second() ?? 0 })
            setIsShowTimePanel(false)
          }}
          onChange={(h, m, s) => setHms({ hour: h, minute: m, second: s })}
          onConfirm={(h, m, s) => {
            setValueMm((valueMm as moment.Moment).clone().hour(h).minute(m).second(s).milliseconds(0))
            setIsShowTimePanel(false)
          }}
        />
      }
    >
      <Input
        value={valueMm ? getInputValueByHms(hms) : undefined}
        onChange={v => {
          const hms = parseHmsByString(v)
          setHms(hms)
        }}
        onClick={onHeaderTimeClick}
      />
    </Trigger>
  )
}

interface TimePanelProps {
  hms: Hms
  onChange: (hour: number, minute: number, second: number) => void
  onCancel: () => void
  onConfirm: (hour: number, minute: number, second: number) => void
  ref?
}

export interface Hms {
  hour: number
  minute: number
  second: number
}

function TimePanel(props: TimePanelProps) {
  const { hms, onCancel, onConfirm, onChange, ref } = props

  const [state, setState] = useState<Hms>(hms)

  useLayoutEffect(() => {
    setState(hms)
  }, [hms])

  const onConfirmClick = () => {
    onConfirm(state.hour, state.minute, state.second)
  }

  return (
    <div className="time-panel" ref={ref}>
      <div className="time-panel-content">
        <Hms
          list={genTimeList(24)}
          value={state.hour}
          onChange={hour => {
            const nState = { ...state, hour }
            setState(nState)
            onChange(nState.hour, nState.minute, nState.second)
          }}
        />
        <Hms
          list={genTimeList(60)}
          value={state.minute}
          onChange={minute => {
            const nState = { ...state, minute }
            setState(nState)
            onChange(nState.hour, nState.minute, nState.second)
          }}
        />
        <Hms
          list={genTimeList(60)}
          value={state.second}
          onChange={second => {
            const nState = { ...state, second }
            setState(nState)
            onChange(nState.hour, nState.minute, nState.second)
          }}
        />
      </div>

      <div className="time-panel-footer">
        <Button size="small" type="text" onClick={onCancel}>
          取消
        </Button>
        <Button size="small" onClick={onConfirmClick}>
          确认
        </Button>
      </div>
    </div>
  )
}

interface HmsProps {
  list: number[]
  value: number
  onChange: (value: number) => void
}
const Hms = (props: HmsProps) => {
  const { list, value, onChange } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      scrollIntoView(ref.current)
    }
  }, [value])

  return (
    <Scrollbar className="time-panel-scroll" disabledShadowTop>
      {list.map(i => (
        <div
          key={i}
          className={classNames('item', i === value && 'time-selected')}
          onClick={() => onChange(i)}
          ref={el => {
            if (i === value) {
              ref.current = el as HTMLDivElement
            }
          }}
        >
          {padStartZero(i)}
        </div>
      ))}

      <div className="height-placeholder"></div>
    </Scrollbar>
  )
}
