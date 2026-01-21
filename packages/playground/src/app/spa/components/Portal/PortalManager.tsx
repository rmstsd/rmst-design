import * as React from 'react'

type State = {
  portals: {
    key: number
    children: React.ReactNode
  }[]
}

/**
 * Portal host is the component which actually renders all Portals.
 */
export default class PortalManager extends React.PureComponent<{}, State> {
  state: State = {
    portals: []
  }

  mount = (key: number, children: React.ReactNode) => {
    this.setState(state => ({
      portals: [...state.portals, { key, children }]
    }))
  }

  update = (key: number, children: React.ReactNode) => {
    this.setState(state => ({
      portals: state.portals.map(item => {
        if (item.key === key) {
          return { ...item, children }
        }
        return item
      })
    }))
  }

  unmount = (key: number) => {
    this.setState(state => ({
      portals: state.portals.filter(item => item.key !== key)
    }))
  }

  render() {
    return this.state.portals.map(({ key, children }) => (
      <div key={key} className="portal-container">
        {children}
      </div>
    ))
  }
}
