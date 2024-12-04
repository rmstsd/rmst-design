import { createContext } from 'react'

type Size = 'small' | 'default' | 'large'

interface ConfigProviderProps {
  prefixCls?: string
  size?: Size
}

export type InteractProps = Partial<{
  size: Size
  readOnly: boolean
  disabled: boolean
}>

const ConfigContext = createContext<ConfigProviderProps>({ prefixCls: 'rmst', size: 'default' })

export default ConfigContext
