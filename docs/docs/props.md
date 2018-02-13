# Props

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
