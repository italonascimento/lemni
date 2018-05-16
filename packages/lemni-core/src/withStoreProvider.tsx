import * as React from 'react'
import { ComponentClass } from 'react'
// import { StoreProvider } from './StoreProvider'


export const withStoreProvider = (store: any) => {
  const {Provider, Consumer} = React.createContext({})

  return (WrappedComponent: ComponentClass<any>) =>
    (props: any) => (
      <Provider value={ store }>
        <Consumer>
          {storeObject => <WrappedComponent { ...props } store={storeObject} />}
        </Consumer>
      </Provider>
    )
}
