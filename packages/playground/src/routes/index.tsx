import { Navigate, RouteObject } from 'react-router'
import Layout from '../layout/Layout'

import Button from '../pages/Button'
import Select from '../pages/Select'
import Image from '../pages/Image'
import Trigger from '../pages/Trigger'
import DatePickerDd from '../pages/DatePicker'
import InputDd from '../pages/Input'
import MaskDd from '../pages/Mask'
import ModalDd from '../pages/Modal'
import TextEllipsisDd from '../pages/TextEllipsis'
import DrawerDd from '../pages/Drawer/DrawerDd'
import CollapseDd from '../pages/Collapse/CollapseDd'
import GridDd from '../pages/Grid/GridDd'
import AHome from '../pages/AHome/AHome'

interface componentsConfig {
  group: string
  components: RouteObject[]
}

export const componentsConfig: componentsConfig[] = [
  {
    group: '练习',
    components: [
      {
        path: 'aHome',
        element: <AHome />
      }
    ]
  },
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
    group: '布局',
    components: [
      {
        path: 'Grid',
        element: <GridDd />
      }
    ]
  },
  {
    group: '反馈',
    components: [
      {
        path: 'Modal',
        element: <ModalDd />
      },
      {
        path: 'Drawer',
        element: <DrawerDd />
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
      },
      {
        path: 'Collapse',
        element: <CollapseDd />
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
      // {
      //   path: 'LdLayout',
      //   element: <LdLayout />
      // },
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
