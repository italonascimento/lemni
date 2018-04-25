import * as React from 'react'
import { ComponentClass } from 'react'
// import { StoreProvider } from './StoreProvider'


export const withStoreProvider = (store: any) => {
  const {Provider, Consumer} = React.createContext({})

  return (WrappedComponent: ComponentClass<any>) =>
    (props: any) => (
      <Provider value={ store }>
        <Consumer>
          {store => <WrappedComponent { ...props } store={store} />}
        </Consumer>
      </Provider>
    )
}
