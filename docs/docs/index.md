# Hello World

The `reuse` function takes in a function which receives `sources` and return `sinks` (any similarity with Cycle.js is not just coincidence).

```typescript
const App = reuse(sources => {
  // Component logic goes here

  const sinks = {
    view: () => (
      <div>Hello World</div>
    )
  }

  return sinks
})
```

The value returned by `reuse` is a common React component which can be used just like any other React component:

```typescript
ReactDOM.render(<App />, document.getElementById('app'))
```