# Props

A stream of props is available through the sources object. The raw props are also passed to the `view` sink, so it can be easely used on the rendering.

```typescript
interface Props {
  name: string
}

const Hello = reuse<Props>(sources => {
  
  // Important uses of the props' stream will
  // be explored later on this documentation
  const props$ = sources.props

  return {
    view: ({ props }) => (
      <div>Hello {props.name}</div>
    )
  }
}

ReactDOM.render(
  <Hello name='World' />,
  document.getElementById('app')
)
```
