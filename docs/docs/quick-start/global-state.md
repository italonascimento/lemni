# Global State (Store)

Reuse - unlike most frontend frameworks - has it's own way of managing an application's global state, which is in fact much similar to how it manages a component's local state.

Unlike the local state, though, for the global state to work we must first create a central data repository - the *store* - and make it available through the whole application by using React context.

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

## Updating And Consuming The Store

As mentioned above, global state in Reuse is managed almost in the same way as a component's local state, with only a slightly different terminology: it is updated using the `storeReducer` sink, and is available through the `sources.store` stream.

It's important to notice, though, that unlike the local state, the store is not available inside the `view` sink function. This means that instead of directly accessing the global app's state inside our rendering function, we must first copy to the local state the pieces of data of our interest.

```typescript
import reuse from 'reuse'
import xs from 'xstream'

const GlobalIncrementer = reuse(sources => {
  const onIncrement = xs.Stream.create()

  return {
    initialState: {
      count: 0,
    },

    // copy store.count to local state
    stateReducer: sources.store
      .map(store => store.count)
      .map(count => ({
        count,
      }))
    ,

    // update store on click
    storeReducer: onIncrement.mapTo(
      store => ({
        count: store.count + 1,
      })
    ),

    view: ({ state, emitter }) => (
      <p>Count: {state.count}</p>
      <button onClick={emmiter(onIncrement).signal}>
        Increment
      </button>
    )
  }
})
```