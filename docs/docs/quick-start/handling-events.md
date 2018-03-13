# Handling Events

As everything else, user interaction in Lemni is managed through streams. When an interface event occurs, instead of calling a function (the traditional React way), we emit the event to a stream.

```typescript
import lemni from 'lemni'
import xs from 'xstream'

const App = lemni(
  sources => {
    const someAction = xs.Stream.create()

    return {
      view: ({ emitter }) => (
        <button onClick={emitter(someAction).emit}>
          Do some action
        </button>
      )
    }
  }
)
```

Note the `emitter` constructor, extracted from the `view` argument. This helper allows us to easely forward an event's parameter directly to a stream, but not only that - it also lets us send arbitrary values or no value at all (a.k.a. `undefined`).

## The `emitter`

The `emitter` constructor receives a stream and returns an object containing three methods: `emit`, `signal` and `emitValue`. The three of them return functions that we can be passed to event props in JSX.

* `emit` will forward the event parameter to a specified stream;
* `signal` will emit `undefined` to a specified stream, which is pretty helpful when the parameter doesn't matter;
* `emitValue` will emit an arbitrary value to the stream.

```typescript
import lemni from 'lemni'
import xs from 'xstream'

const App = lemni(
    sources => {
    const firstAction = xs.Stream.create<SyntheticEvent>()
    const secondAction = xs.Stream.create<undefined>()
    const thirdAction = xs.Stream.create<number>()

    return {
      view: ({ emitter }) => (
        <button onClick={emitter(firstAction).emit}>First action</button>
        <button onClick={emitter(secondAction).signal}>Second action</button>
        <button onClick={emitter(thirdAction).emitValue(2)}>Third action</button>
      )
    }
  }
)
```

The `onClick` prop of a button receives a function as argument. Once we click on the button, an object of type `SyntheticEvent` is passed to the function.

In the above example, if we click on the first button, the `SynteticEvent` will be emited by the `firstAction` stream, as we're using `emitter.emit`.

If we click on the second button, though, the `SynteticEvent` will be discarted and `secondAction` will emit `undefined`, as `emitter.signal` just *signals* an event occurred.

Then, if we click on the third button, the `SynteticEvent` will be discarted and `thirdAction` will emit the constant value `2`, as passed to `emitter.emitValue`.