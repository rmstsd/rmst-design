import { Navigate, RouteObject } from 'react-router-dom'
import Layout from '../layout/Layout'

import Button from '../pages/Button'
import Select from '../pages/Select'
import Image from '../pages/Image'
import Trigger from '../pages/Trigger'
import DatePickerDd from '../pages/DatePicker'
import InputDd from '../pages/Input'
import { LdLayout } from 'rmst-design'

interface componentsConfig {
  group: string
  components: RouteObject[]
}

export const componentsConfig: componentsConfig[] = [
  {
    group: '基础',
    components: [
      {
        path: 'button',
        element: <Button />
      }
    ]
  },
  {
    group: '数据输入',
    components: [
      {
        path: 'input',
        element: <InputDd />
      },
      {
        path: 'select',
        element: <Select />
      },
      {
        path: 'datePicker',
        element: <DatePickerDd />
      }
    ]
  },
  {
    group: '数据展示',
    components: [
      {
        path: 'image',
        element: <Image />
      }
    ]
  },
  {
    group: '其他',
    components: [
      {
        path: 'trigger',
        element: <Trigger />
      },
      {
        path: 'LdLayout',
        element: <LdLayout />
      }
    ]
  }
]

export const componentsRoute: RouteObject = {
  path: '/components',
  element: <Layout />,
  children: componentsConfig.reduce<RouteObject[]>((acc, item) => acc.concat(item.components), [])
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/components/button" />
  },
  {
    path: '/components',
    element: <Navigate to="/components/button" />
  },
  componentsRoute
]

export default routes
