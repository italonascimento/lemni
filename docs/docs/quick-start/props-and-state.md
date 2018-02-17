# Props and State

## Props

A stream of props is available through the sources object. The raw props are also passed to the `view` sink, so it can be easely used on the rendering.

```typescript
import reuse from 'reuse'
import ReactDOM from 'react-dom'

interface Props {
  name: string
}

const Hello = reuse<Props>(sources => {
  const props$ = sources.props

  return {
    view: ({ props }) => (
      <div>Hello {props.name}</div>
    )
  }
})

ReactDOM.render(
  <Hello name='World' />,
  document.getElementById('app')
)
```

## Component State

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