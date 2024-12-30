import { Navigate, RouteObject } from 'react-router-dom'
import Layout from '../layout/Layout'
import { LdLayout } from 'rmst-design'

import Button from '../pages/Button'
import Select from '../pages/Select'
import Image from '../pages/Image'
import Trigger from '../pages/Trigger'
import DatePickerDd from '../pages/DatePicker'
import InputDd from '../pages/Input'
import MaskDd from '../pages/Mask'
import ModalDd from '../pages/Modal'
import TextEllipsisDd from '../pages/TextEllipsis'

interface componentsConfig {
  group: string
  components: RouteObject[]
}

export const componentsConfig: componentsConfig[] = [
  {
    group: '基础',
    components: [
      {
        path: 'Button',
        element: <Button />
      },
      {
        path: 'TextEllipsis',
        element: <TextEllipsisDd />
      }
    ]
  },
  {
    group: '反馈',
    components: [
      {
        path: 'Modal',
        element: <ModalDd />
      }
    ]
  },
  {
    group: '数据输入',
    components: [
      {
        path: 'Input',
        element: <InputDd />
      },
      {
        path: 'Select',
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
        path: 'Image',
        element: <Image />
      }
    ]
  },
  {
    group: '其他',
    components: [
      {
        path: 'Trigger',
        element: <Trigger />
      },
      {
        path: 'LdLayout',
        element: <LdLayout />
      },
      {
        path: 'Mask',
        element: <MaskDd />
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
