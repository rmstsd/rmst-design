import { PropsWithChildren, RefObject, use } from 'react'
import ConfigContext, { InteractProps } from '../_util/ConfigProvider'

import { LoaderCircle } from 'lucide-react'

import './style/style.less'
import clsx from 'clsx'
import { useAnTransition } from '../_util/hooks'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement>, PropsWithChildren, InteractProps {
  ref?: RefObject<HTMLButtonElement>
  type?: 'primary' | 'outline' | 'text'
  loading?: boolean
  icon?: React.ReactNode
}

const defaultProps: Partial<ButtonProps> = {
  type: 'primary',
  size: 'default'
}

export function Button(props: ButtonProps) {
  const { className, children, size = 'primary', disabled, loading, type, icon, ...restProps } = { ...defaultProps, ...props }
  const { prefixCls } = use(ConfigContext)
  const btnPrefixCls = `${prefixCls}-btn`

  const iconOnly = !children

  const rootCls = clsx(
    btnPrefixCls,
    `${btnPrefixCls}-size-${size}`,
    `${btnPrefixCls}-${type}`,
    {
      [`${btnPrefixCls}-disabled`]: disabled,
      [`${btnPrefixCls}-loading`]: loading,
      [`${btnPrefixCls}-icon-only`]: iconOnly
    },
    className
  )

  const { shouldMount, setDomRef } = useAnTransition({
    open: loading,
    keyframes: dom => {
      return [
        { width: '0px', opacity: 0 },
        { width: `${dom?.offsetWidth}px`, opacity: 1 }
      ]
    }
  })

  const renderIcon = () => {
    if (shouldMount) {
      return (
        <span className={`icon-wrapper ${btnPrefixCls}-loading-wrapper`} ref={setDomRef}>
          <LoaderCircle color="currentColor" className="loading-icon rotate-continuously" />
        </span>
      )
    }

    if (icon) {
      return <span className="icon-wrapper">{icon}</span>
    }

    return null
  }

  return (
    <button {...restProps} className={rootCls} disabled={disabled || loading}>
      {renderIcon()}

      {children}
    </button>
  )
}
