# Global State

Reuse - unlike most frontend frameworks - has it's own way of managing application's global state, which is much similar to how we manage a component's local state: the global state is updated using the `storeReducer` sink, and is available to the component through the `sources.store` stream.

Unlike the local state, though, we must first create the store and make it available to the whole application through the React context.

## Creating a Store

To create a global store, use the helper function `createStore`.

```typescript
import { createStore } from 'reuse'

interface Store {
  foo: string
}

const initialStore = {
  foo: 'bar'
}

const globalStore = createStore<Store>(initialStore)
```

## Making the store available

To make the global store available, use the High Order Component `withStoreProvider`.

```typescript
import App from './app'
import store from './store'

const AppWithGlobalStore = withStoreProvider(store)(App)

ReactDOM.render(<AppWithGlobalStore />, document.getElementById('app'))
```