import type React from 'react'

import { useContext, useLayoutEffect, useRef } from 'react'

import PortalHost, { PortalContext, PortalMethods } from './PortalHost'
import PortalConsumer from './z_PortalConsumer'

export type Props = {
  children: React.ReactNode
}

/**
 * Portal allows rendering a component at a different place in the parent tree.
 * You can use it to render content which should appear above other elements, similar to `Modal`.
 * It requires a [`Portal.Host`](PortalHost) component to be rendered somewhere in the parent tree.
 * Note that if you're using the `Provider` component, this already includes a `Portal.Host`.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Portal, Text } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Portal>
 *     <Text>This is rendered at a different place</Text>
 *   </Portal>
 * );
 *
 * export default MyComponent;
 * ```
 */
// class Portal extends React.Component<Props> {
//   static Host = PortalHost

//   render() {
//     const { children } = this.props

//     return (
//       <PortalContext.Consumer>
//         {manager => <PortalConsumer manager={manager as PortalMethods}>{children}</PortalConsumer>}
//       </PortalContext.Consumer>
//     )
//   }
// }

const Portal = (props: Props) => {
  const { children } = props
  const manager = useContext(PortalContext)

  const firstRenderRef = useRef(true)
  const keyRef = useRef<number>(0)

  useLayoutEffect(() => {
    if (firstRenderRef.current) {
      keyRef.current = manager.mount(children)
      firstRenderRef.current = false

      return
    }

    manager.update(keyRef.current, children)
  })

  useLayoutEffect(() => {
    return () => {
      manager.unmount(keyRef.current)
    }
  }, [])

  return null
}

Portal.Host = PortalHost

export default Portal
