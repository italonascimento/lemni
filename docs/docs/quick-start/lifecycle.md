# Lifecycle

Lifecycle streams may be accessed through `sources.lifecycle` object, under the same names of React's lifecycle functions.

```typescript
import reuse from 'reuse'

const Incrementer = reuse(
  sources => ({
    initialState: {
      isMounted: false,
    },

    stateReducer: sources.lifecycle
      .componentDidMount
      .mapTo(state => ({
        isMounted: true,
      })),
  })
)
```