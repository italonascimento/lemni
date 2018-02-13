# Lifecycle

Every React lifecycle event is emitted in the `sources.lifecycle` stream.

```typescript
import reuse, { ReactLifecycle } from 'reuse'

interface State {
  isMounted: boolean
}

const Incrementer = reuse<{}, State>(sources => ({
    initialState: {
      isMounted: false,
    },

    stateReducer: sources.lifecycle
      .filter(event => event === ReactLifecycle.componentDidMount)
      .mapTo((state: State) => ({
        isMounted: true,
      })),
  })
)
```