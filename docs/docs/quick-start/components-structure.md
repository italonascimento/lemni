# Component's Structure

A Lemni component is a function which receives a `sources` object and returns a `sinks` object.

The `sources` is how we access - as streams - all the data from the React side, such as props, state, lifecycle, etc.

The `sinks` is how we describe our component's behaviour and side effecs, in a declarative way. In other words, **side effects are never executed imperatively inside a component implementation; they are instead described in the sinks, to be isolated executed on the Lemni side**.

```typescript
const component = (sources) => {
  const sinks = {}
  return sinks
}
```

## Hello World

A simple component may return a `sinks` object containing only a `view` property, which is responsible for describing how the component should render.

```typescript
const HelloWorld = (sources) => ({
  view: (viewArgs) =>
    <div>
      <p>Hello World</p>
    </div>
})
```

Now our component is implemented, we must use Lemni to convert it to a conventional React component:

```typescript
import ReactDOM from 'react-dom'
import lemni from 'lemni'

const main = (sources) => ({
  view: (viewArgs) =>
    <div>
      <p>Hello World</p>
    </div>
})

const HelloWorld = lemni(main)

ReactDOM.render(
  <HelloWorld />,
  document.getElementById('app')
)
```