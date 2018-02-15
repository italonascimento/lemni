# Get Started

## Introduction

Reuse exports a `reuse` function, which expects a `main` component function as it's only argument and returns a traditional React component - `React.ComponentClass`.

The `main` function is how the Reuse component is actually defined. It receives a `sources` object, which provides the component with the information it needs, and returns a `sinks` object, which specifies how the component should behaviour.

```typescript
const main = (sources) => {
  const sinks = {}
  return sinks
}

const component = reuse(main)
```

## Hello World

The `reuse` function takes in a function which receives `sources` and return `sinks` (any similarity with Cycle.js is not just coincidence).

```typescript
import reuse from 'reuse'
import ReactDOM from 'react-dom'

const App = reuse(
  sources => ({
    view: () => (
      <div>Hello World</div>
    )
  })
)

ReactDOM.render(<App />, document.getElementById('app'))
```