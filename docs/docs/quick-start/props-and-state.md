# Props and State

Props and state are the two main sources of truth in a React component. In Lemni, streams of props and state are available through the `sources` object, what enables us to combine or compose them with other asynchronous data, such as lifecycle events or user interaction.

However, as two particularly important sources of truth, they are also passed as plain objects to the `view` sink, so we can easely use them in the rendering.

```typescript
import { lemni } from 'lemni'

const Component = lemni(
  (sources) => {
    // streams of props and state
    const { props, state } = sources

    return {
      // plain props and state objects
      // (pay atention to the destructuring of the argument)
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

As showed above, there are two ways of using a component's props in Lemni:

* through the argument of the `view` function, as a plain object for rendering purposes;
* through the `sources.props` stream, generaly used for composition of streams - as shown on the [State](#state) topic bellow. 

Any changes on a component's props will cause the `view` sink function to be called again with the updated value, as well as trigger a new emission on the `sources.props` stream.

## State

As with props, the state of a component is assessible from the `sources.state` stream, as well as from the `view` sink argument.

Unlike props, though, the state can be updated from inside the component who owns it. Since this is a side effect, it must be done through a sink. In this case, the `stateReducer` sink.

A `initialState` sink may also be used to set the initial state when needed.

```typescript
import { lemni } from 'lemni'
import xs from 'xstream'

const Incrementer = lemni(sources => {
  const onIncrement = xs.Stream.create()

  return {
    initialState: {
      count: 0,
    },

    stateReducer: onIncrement.mapTo(
      state => ({
        count: state.count + 1,
      })
    ),

    // see more about the emitter in Handling Events section
    view: ({ state, emitter }) => (
      <p>Count: {state.count}</p>
      <button onClick={emmiter(onIncrement).emit}>
        Increment
      </button>
    )
  }
})
``` 

The `stateReducer` sink is a stream of state reducers: functions which receive the latest state as argument and return a new one.

For a more complex example, we may compose state and props streams to achieve a more generic incrementer, whose step size are specified via props:

```typescript
import { lemni } from 'lemni'
import sampleCombine from 'xstream/extra/sampleCombine'
import xs from 'xstream'

const Incrementer = lemni(
  (sources) => {
    const onIncrement = xs.Stream.create()

    return {
      initialState: {
        count: 0
      }

      stateReducer: onIncrement
        .compose(sampleCombine(
          sources.props
            .map(props => props.step)
        ))
        .map(([_clickEvent, step]) =>
          state => ({
            count: state.count + step
          })
        )

      view: ({ props, state, emitter }) => (
        <div>
          <p>Count: {state.count}</p>
          <button onClick={emitter.emit(onIncrement)}>
            Increment {props.step}
          </button>
        </div>
      )
    }
  }
)
```

Now we can render an incrementer which jump two units per click:

```typescript
<Incrementer step={2} />
```