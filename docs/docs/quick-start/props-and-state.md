# Props and State

The `props` and `state` objects are the two main sources of truth in a React component. In Reuse, streams of props and state are available through the `sources` object, what enables us to combine or compose them with other asynchronous data, such as lifecycle events or user interaction.

However, as two particularly important sources of truth, they are also passed as plain objects to the `view` sink, so we can easely use them in the rendering.

```typescript
const Component = reuse(
  (sources) => {
    const { props, state } = sources

    return {
      // pay atention to the destructuring of the argument
      view: ({ props, state }) => (
        <div>
          <p>{props.foo}<p/>
          <p>{state.bar}<p/>
        </div>
      )
    }
  }
)
```

## Props

There are two ways of using a component's props:

* through the argument of the `view` function, for rendering prposes;
* through the `sources.props` stream, generaly used for composition of streams - as shown on the [State](#state) topic bellow. 

Any changes on a component's props will cause the `view` sink function to be called again with the updated value, as well as trigger a new emission on the `sources.props` stream.

## State

The state management is made through the `stateReducer` sink, which is a stream of reducer functions. Each reducer function must receive the latest state as argument and return a new one.

A `initialState` sink may be used to set the initial state when needed.

The raw state is passed to the `view` sink for use in the rendering.

```typescript
import reuse from 'reuse'

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
})
``` 