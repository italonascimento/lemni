# Global State (Store)

Reuse - unlike most frontend frameworks - has it's own way of managing an application's global state, and it is much similar to how we manage a component's local state, with only a slightly different terminology: it is updated using the `storeReducer` sink, and is available through the `sources.store` stream.

Unlike the local state, though, we must first create the store and make it available to the whole application through the React context.

## Creating The Store

To create the store, use the helper function `createStore`.

```typescript
import { createStore } from 'reuse'

const initialStore = {
  foo: 'bar',
}

const globalStore = createStore(initialStore)
```

Now, to make it available through the whole app, use the High Order Component `withStoreProvider`.

```typescript
import App from './app'
import store from './store'
import { withStoreProvider } from 'reuse'

const AppWithGlobalStore = withStoreProvider(store)(App)

ReactDOM.render(<AppWithGlobalStore />, document.getElementById('app'))
```

# Consuming Data From Store

*TODO*