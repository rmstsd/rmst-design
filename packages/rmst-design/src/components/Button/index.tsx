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
}

const defaultProps: Partial<ButtonProps> = {
  type: 'primary',
  size: 'default'
}

export function Button(props: ButtonProps) {
  const { className, children, size = 'primary', disabled, loading, type, ...restProps } = { ...defaultProps, ...props }
  const { prefixCls } = use(ConfigContext)
  const btnPrefixCls = `${prefixCls}-btn`

  const rootCls = clsx(
    btnPrefixCls,
    `${btnPrefixCls}-size-${size}`,
    `${btnPrefixCls}-${type}`,
    { [`${btnPrefixCls}-disabled`]: disabled },
    className
  )

  const { shouldMount, setDomRef } = useAnTransition({
    open: loading,
    keyframes: dom => {
      return [
        { width: '0px', opacity: 0 },
        { width: '20px', opacity: 1 }
      ]
    }
  })

  return (
    <button {...restProps} className={rootCls} disabled={disabled}>
      {shouldMount && (
        <span className={`${btnPrefixCls}-loading-wrapper`} ref={setDomRef}>
          <LoaderCircle color="#ddd" size={20} />
        </span>
      )}

      {children}
    </button>
  )
}
