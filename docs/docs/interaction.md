# Interaction

All interaction in Reuse is managed through event streams. The events are defined inside the component function and emited inside the `view` sink. To easely emit events, use the `emitter` helper passed to `view`.

```typescript
const App = reuse(sources => {
  const someAction = Stream.create<SyntheticEvent>()

  return {
    view: ({ emitter }) => (
      <button onClick={emmiter.emit(someAction)}>Do some action</button>
    )
  }
}
```

The `emitter` object has three methods: `emit`, `signal` and `emitValue`:

* `emit` is used to create a lambda which emits to the stream de received argument;
* `signal` is used to create a lambda which emits `undefined` to the stream. You may use it when the value doesn't metter;
* `emitValue` is used to create a lambda which emits a constant value to the stream.

```typescript
import reuse from 'reuse'

const App = reuse(sources => {
  const firstAction = Stream.create<SyntheticEvent>()
  const secondAction = Stream.create<undefined>()
  const thirdAction = Stream.create<number>()

  return {
    view: ({ emitter }) => (
      <button onClick={emmiter.emit(firstAction)}>First action</button>
      <button onClick={emmiter.signal(secondAction)}>Second action</button>
      <button onClick={emmiter.emitValue(2)(thirdAction)}>Third action</button>
    )
  }
})
```