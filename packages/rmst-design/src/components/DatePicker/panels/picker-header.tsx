import classNames from 'clsx'
import { Mode } from '../index'
import { padStartZero, type Years } from '../date-utils'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoveLeft } from 'lucide-react'

interface PickerHeaderProps {
  mode: Mode
  value: moment.Moment
  onPrev?: () => void
  onNext?: () => void
  onSuperPrev?: () => void
  onSuperNext?: () => void
  onChangePanel?: (mode: Mode) => void
  years?: Years
}

const PickerHeader = (props: PickerHeaderProps) => {
  const { mode, value, onPrev, onNext, onSuperPrev, onSuperNext, onChangePanel, years = [] } = props

  const renderLabel = () => {
    if (mode === 'date') {
      return (
        <>
          <span className="picker-header-label" onClick={() => onChangePanel?.('year')}>
            {value.year()}
          </span>
          <span>-</span>
          <span className="picker-header-label" onClick={() => onChangePanel?.('month')}>
            {padStartZero(value.month() + 1)}
          </span>
        </>
      )
    }

    if (mode === 'year') {
      if (years.length === 0) {
        return null
      }

      return (
        <span>
          {years[0].name} - {years.at(-1)?.name}
        </span>
      )
    }

    if (mode === 'month') {
      return (
        <span className="picker-header-label" onClick={() => onChangePanel?.('year')}>
          {value.year()}
        </span>
      )
    }

    return null
  }

  const showPrev = mode === 'date'
  const showNext = mode === 'date'

  return (
    <div className="picker-header">
      <div className="picker-header-icon" onClick={() => onSuperPrev?.()}>
        <ChevronsLeft />
      </div>
      <div className={classNames('picker-header-icon', !showPrev && 'hidden')} onClick={() => onPrev?.()}>
        <ChevronLeft />
      </div>
      <div className="picker-header-value">{renderLabel()}</div>
      <div className={classNames('picker-header-icon', !showNext && 'hidden')} onClick={() => onNext?.()}>
        <ChevronRight />
      </div>
      <div className="picker-header-icon" onClick={() => onSuperNext?.()}>
        <ChevronsRight />
      </div>
    </div>
  )
}

export default PickerHeader
