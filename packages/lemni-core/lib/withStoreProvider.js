import * as React from 'react';
import { StoreProvider } from './StoreProvider';
export const withStoreProvider = (store) => (WrappedComponent) => (props) => (React.createElement(StoreProvider, { store: store },
    React.createElement(WrappedComponent, Object.assign({}, props))));
//# sourceMappingURL=withStoreProvider.js.map