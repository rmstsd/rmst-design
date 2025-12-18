import { use, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'

import { mergeProps, useControllableValue, useInteract } from '../_util/hooks'
import { Trigger } from '../Trigger'
import { Empty } from '../Empty'
import { keyboardKey } from '../_util/keycode'
import getHotkeyHandler from '../_util/getHotkeyHandler'

import './style.less'
import clsx from 'clsx'
import { clamp } from 'es-toolkit'
import { IconWrapper } from '../IconWrapper'
import { ChevronDown, X } from 'lucide-react'
import { Scrollbar } from '../Scrollbar'

type OptionItem = { value: string | number; label: string | number }
interface SelectProps extends InteractProps {
  options?: OptionItem[]
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

const defaultProps: SelectProps = {
  options: []
}

export function Select(props: SelectProps) {
  props = mergeProps(defaultProps, props)
  const { size, readOnly, disabled, options: propsOptions, placeholder, className, style } = props

  const { prefixCls, size: ctxSize } = use(ConfigContext)
  const merSize = size ?? ctxSize
  const selectPrefixCls = `${prefixCls}-select`

  const [value, onChange] = useControllableValue({ ...props })
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const optionRefList = useRef<HTMLDivElement[]>([])
  const interact = useInteract(selectPrefixCls, { size: merSize, readOnly, disabled })
  const [hoverIndex, setHoverIndex] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  const options = searchValue
    ? propsOptions.filter(item => item.label.toString().toLowerCase().includes(searchValue.toLowerCase()))
    : propsOptions

  // 与关闭动画有关
  const selectedItem = (visible ? options : propsOptions).find(item => item.value === value)

  const cb = useEffectEvent(() => {
    if (visible) {
      let index = options.findIndex(item => item.value === value)
      if (index === -1) {
        index = 0
      }

      setHoverIndex(index)
      scrollIntoView(index)
    }
  })
  useLayoutEffect(cb, [visible, value, searchValue])

  const keepFocus = (evt: React.PointerEvent<HTMLDivElement>) => {
    evt.preventDefault()
  }

  const scrollIntoView = (index: number) => {
    const dom = optionRefList.current[index]
    if (dom) {
      scrollIntoViewIfNeeded(dom, { block: 'nearest', inline: 'nearest' })
    }
  }

  const hide = () => {
    setVisible(false)
    interact.setIsFocused(false)
    inputRef.current.blur()
  }

  const onPrev = () => {
    const index = clamp(hoverIndex - 1, 0, options.length - 1)
    setHoverIndex(index)
    scrollIntoView(index)
  }
  const onNext = () => {
    const index = clamp(hoverIndex + 1, 0, options.length - 1)
    setHoverIndex(index)
    scrollIntoView(index)
  }

  const onKeyDown = getHotkeyHandler(
    new Map([
      [keyboardKey.Esc, () => hide()],
      [
        keyboardKey.ArrowUp,
        evt => {
          evt.preventDefault()
          onPrev()
        }
      ],
      [
        keyboardKey.ArrowDown,
        evt => {
          evt.preventDefault()
          onNext()
        }
      ],
      [
        keyboardKey.Enter,
        evt => {
          evt.preventDefault()
          onSelect(options[hoverIndex])
        }
      ]
    ])
  )

  const onSelect = (item: OptionItem) => {
    hide()
    onChange?.(item.value)
  }

  const popup = (
    <Scrollbar className={`${selectPrefixCls}-options-wrapper`} onPointerDown={keepFocus} disabledShadowBottom disabledShadowTop>
      {options.length === 0 && <Empty />}
      {options.map((item, index) => (
        <div
          key={item.value}
          className={clsx(`${selectPrefixCls}-option-item`, {
            active: item.value === value,
            hover: hoverIndex === index
          })}
          onPointerEnter={() => setHoverIndex(index)}
          onPointerLeave={() => setHoverIndex(-1)}
          onClick={() => onSelect(item)}
          ref={el => {
            optionRefList.current[index] = el
          }}
        >
          {item.label}
        </div>
      ))}
    </Scrollbar>
  )

  return (
    <Trigger
      popup={popup}
      autoAlignPopupWidth
      trigger="focus"
      value={visible}
      disabled={interact.isDisabledOrReadonly}
      onChange={visible => {
        if (interact.isDisabledOrReadonly) {
          return
        }

        setVisible(visible)
        if (visible === false) {
          hide()
        }
      }}
      onExited={() => {
        setSearchValue('')
      }}
    >
      <div
        className={clsx(interact.cls, className)}
        style={style}
        tabIndex={disabled ? undefined : -1}
        onKeyDown={onKeyDown}
        onFocus={() => {
          inputRef.current.focus()
          interact.setIsFocused(true)
        }}
        onBlur={() => {
          interact.setIsFocused(false)
        }}
      >
        <input
          ref={inputRef}
          disabled={disabled}
          placeholder={visible ? selectedItem?.label.toString() || placeholder : placeholder}
          readOnly={readOnly}
          value={visible ? searchValue : selectedItem?.label ?? ''}
          onChange={evt => setSearchValue(evt.target.value)}
        />

        <span className="suffix">
          {value && !interact.isDisabledOrReadonly ? (
            <IconWrapper className="clear" onClick={() => onChange('')} onPointerDown={evt => evt.preventDefault()}>
              <X />
            </IconWrapper>
          ) : null}

          <ChevronDown className="select-arrow" style={{ transform: visible ? 'rotate(180deg)' : '' }} />
        </span>
      </div>
    </Trigger>
  )
}
