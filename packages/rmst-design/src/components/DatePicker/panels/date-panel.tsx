import classNames from 'clsx'
import moment from 'moment'
import { useLayoutEffect, useMemo, useState } from 'react'

import { DayPoint, genDays, genYears, MONTHS_CN, WEEK_DAYS_CN } from '../date-utils'
import { type Mode } from '../index'
import PickerHeader from './picker-header'

interface PickerPanelProps {
  mode: Mode
  setMode: (mode: Mode) => void
  valueMm: moment.Moment | undefined
  selectDay: (col: DayPoint) => void
}

export default function PickerPanel(props: PickerPanelProps) {
  const { mode, setMode, valueMm, selectDay } = props

  const [panelMm, setPanelMm] = useState<moment.Moment>(moment())

  useLayoutEffect(() => {
    if (valueMm) {
      setPanelMm(valueMm.clone())
    }
  }, [valueMm])

  const today = useMemo(() => moment(), [])

  const year = panelMm.year()
  const month = panelMm.month()
  const yearList = genYears(year)

  function changeMonthTo(m: number) {
    setPanelMm(panelMm.clone().month(m))
    setMode('date')
  }

  function changeYearTo(y: number) {
    setPanelMm(panelMm.clone().year(y))
    setMode('month')
  }

  const onChangePanel = (mode: Mode) => {
    setMode(mode)
  }

  const onNext = () => {
    setPanelMm(panelMm.clone().add(1, 'month'))
  }
  const onPrev = () => {
    setPanelMm(panelMm.clone().subtract(1, 'month'))
  }

  const onSuperNext = () => {
    if (mode === 'year') {
      setPanelMm(panelMm.clone().add(10, 'year'))
      return
    }
    setPanelMm(panelMm.clone().add(1, 'year'))
  }
  const onSuperPrev = () => {
    if (mode === 'year') {
      setPanelMm(panelMm.clone().subtract(10, 'year'))
      return
    }
    setPanelMm(panelMm.clone().subtract(1, 'year'))
  }

  const renderPanel = () => {
    const { year: valueYear, month: valueMonth, date: valueDate } = getYmdByMoment(valueMm)

    if (mode === 'date') {
      const dayList = genDays(year, month)

      return (
        <div className="panel-date">
          <GridPanel list={[WEEK_DAYS_CN()]} renderCell={cell => <div className="panel-date-week-item">{cell}</div>} />
          <GridPanel
            list={dayList}
            renderCell={cell => {
              const isSelected = cell.y === valueYear && cell.m === valueMonth && cell.d === valueDate
              return (
                <div className={classNames('picker-cell-date', cell.c, isSelected && 'selected')} onClick={() => selectDay(cell)}>
                  {cell.d}
                </div>
              )
            }}
          />
        </div>
      )
    }

    if (mode === 'month') {
      const monthGridList = genThreeColumns(MONTHS_CN(today))

      return (
        <div className="panel-month">
          <GridPanel
            list={monthGridList}
            renderCell={cell => {
              const isThisYear = today.year() === panelMm.year()
              const isSelected = valueYear === panelMm.year() && valueMonth === cell.month

              return (
                <div
                  className={classNames(
                    'picker-cell-date',
                    isThisYear && cell.isCurrentMonth && 'today',
                    isSelected && 'selected'
                  )}
                  onClick={() => changeMonthTo(cell.month)}
                >
                  {cell.name}
                </div>
              )
            }}
          />
        </div>
      )
    }

    if (mode === 'year') {
      const yearGridList = genThreeColumns(yearList)

      return (
        <div className="panel-year">
          <GridPanel
            list={yearGridList}
            renderCell={cell => {
              const isSelected = valueYear === cell.name

              return (
                <div
                  className={classNames('picker-cell-date', cell.currentYear && 'today', isSelected && 'selected')}
                  onClick={() => changeYearTo(cell.name)}
                >
                  {cell.name}
                </div>
              )
            }}
          />
        </div>
      )
    }
  }

  return (
    <div className="date-panel">
      <PickerHeader
        mode={mode}
        value={panelMm}
        onChangePanel={onChangePanel}
        onNext={onNext}
        onPrev={onPrev}
        onSuperNext={onSuperNext}
        onSuperPrev={onSuperPrev}
        years={yearList}
      />
      <div className="picker-body">{renderPanel()}</div>
    </div>
  )
}

const getYmdByMoment = (moment: moment.Moment | undefined) => {
  if (!moment) {
    return { year: -1, month: -1, date: -1 }
  }

  return { year: moment.year(), month: moment.month(), date: moment.date() }
}

const genThreeColumns = <T,>(list: T[]) => {
  return list.reduce<T[][]>((acc, item, index) => {
    const row = Math.floor(index / 3)
    const col = index % 3
    acc[row] = acc[row] || []
    acc[row][col] = item
    return acc
  }, [])
}

interface GridPanelProps<T> {
  list: T[][]
  renderCell: (item: T) => React.ReactNode
}
const GridPanel = <T,>(props: GridPanelProps<T>) => {
  const { list, renderCell } = props

  return (
    <>
      {list.map((row, ri) => {
        return (
          <div key={ri} className="picker-row">
            {row.map((col, ci) => {
              return (
                <div key={ci} className={classNames('picker-cell')}>
                  {renderCell(col)}
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
