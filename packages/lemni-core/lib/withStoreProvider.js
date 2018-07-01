import * as React from 'react';
// import { StoreProvider } from './StoreProvider'
export const withStoreProvider = (store) => {
    const { Provider, Consumer } = React.createContext({});
    return (WrappedComponent) => (props) => (React.createElement(Provider, { value: store },
        React.createElement(Consumer, null, storeObject => React.createElement(WrappedComponent, Object.assign({}, props, { store: storeObject })))));
};
//# sourceMappingURL=withStoreProvider.js.map