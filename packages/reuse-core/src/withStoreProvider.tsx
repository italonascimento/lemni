import * as React from 'react'
import { ComponentClass } from 'react'
import StoreProvider from './StoreProvider'

const withStoreProvider = (store: any) =>
  (WrappedComponent: ComponentClass<any>) =>
    (props: any) => (
      <StoreProvider store={store}>
        <WrappedComponent {...props} />
      </StoreProvider>
    )

export default withStoreProvider
