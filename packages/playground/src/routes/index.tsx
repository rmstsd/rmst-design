import { Navigate, RouteObject } from 'react-router-dom'
import Layout from '../layout/Layout'

import Button from '../pages/Button'
import Select from '../pages/Select'
import Image from '../pages/Image'
import Trigger from '../pages/Trigger'

export const componentsRoute: RouteObject = {
  path: '/components',
  element: <Layout />,
  children: [
    {
      path: 'button',
      element: <Button />
    },
    {
      path: 'image',
      element: <Image />
    },
    {
      path: 'select',
      element: <Select />
    },
    {
      path: 'trigger',
      element: <Trigger />
    }
  ]
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
