# Component state

The state management is made through the `stateReducer` sink, which is a stream of reducer functions. Each reducer function must receive the latest state as argument and return a new one.

A `initialState` sink may be used to set the initial state when needed.

The raw state is passed to the `view` sink for use in the rendering.

```typescript
interface State {
  count: number
}

const Incrementer = reuse<{}, State>(sources => {
  const increment = Stream.create<undefined>()

  return {
    initialState: {
      count: 0,
    },

    stateReducer: increment.mapTo((state: State) => ({
      count: state.count + 1,
    })),

    view: ({ state, emitter }) => (
      <p>Count: {state.count}</p>
      <button onClick={emmiter.signal(increment)}>Increment</button>
    )
  }
}
``` 