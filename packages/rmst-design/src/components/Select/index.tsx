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
import { X } from 'lucide-react'

type OptionItem = { value: string | number; label: string | number }
interface SelectProps extends InteractProps {
  options?: OptionItem[]
  placeholder?: string
}

const defaultProps: SelectProps = {
  options: []
}

export function Select(props: SelectProps) {
  props = mergeProps(defaultProps, props)
  const { size, readOnly, disabled, options: propsOptions, placeholder } = props

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

  const activeItem = options.find(item => item.value === value)

  const cb = useEffectEvent(() => {
    if (visible && value) {
      const index = options.findIndex(item => item.value === value)
      setHoverIndex(index)

      setTimeout(() => {
        scrollIntoView(index)
      })
    }
  })
  useLayoutEffect(cb, [visible, value])

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
    setSearchValue('')
  }

  const onPrev = () => {
    const index = clamp(hoverIndex - 1, 0, options.length - 1)
    setHoverIndex(index)

    requestAnimationFrame(() => {
      scrollIntoView(index)
    })
  }
  const onNext = () => {
    const index = clamp(hoverIndex + 1, 0, options.length - 1)
    setHoverIndex(index)

    requestAnimationFrame(() => {
      scrollIntoView(index)
    })
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
          hide()
          onChange?.(options[hoverIndex].value)
        }
      ]
    ])
  )

  const onSelect = (item: OptionItem) => {
    hide()
    onChange?.(item.value)
  }

  const popup = (
    <div className={`${selectPrefixCls}-options-wrapper`} onPointerDown={keepFocus}>
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
    </div>
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
    >
      <div
        className={interact.cls}
        onPointerDown={() => {
          requestAnimationFrame(() => {
            inputRef.current.focus()
          })
        }}
        tabIndex={disabled ? undefined : -1}
        onKeyDown={onKeyDown}
        onFocus={() => {
          interact.setIsFocused(true)
        }}
        onBlur={() => {
          interact.setIsFocused(false)
        }}
      >
        <input
          ref={inputRef}
          disabled={disabled}
          placeholder={visible ? activeItem?.label.toString() || placeholder : placeholder}
          value={visible ? searchValue : activeItem?.label ?? ''}
          onChange={evt => {
            setSearchValue(evt.target.value)
            setHoverIndex(0)
          }}
        />

        {value && !interact.isDisabledOrReadonly ? (
          <IconWrapper className="clear" onClick={() => onChange('')} onPointerDown={evt => evt.preventDefault()}>
            <X />
          </IconWrapper>
        ) : null}
      </div>
    </Trigger>
  )
}
