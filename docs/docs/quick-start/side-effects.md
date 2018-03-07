# Side Effects

Reuse provides us with a `sideEffects` sink, which is a default way to produce side effects from inside a component.

To produce a side effect, just emit an impure function through this sink and it will be executed on the Reuse side.

```typescript
import reuse from 'reuse'
import xs from 'xstream'

const MyButton = reuse(
  sources => (
    const onClick = xs.Stream.create()

    return {
      sideEffects: onClick
        // mapping to an impure function
        .mapTo(() => {
          // produce side effect
          console.log('Clicked!')
        }),

      view: ({ emitter }) => (
        <button onClick={emitter(onClick).signal}>
          Click Me
        </button>
      )
    }
  )
)
```