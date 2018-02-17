# Introduction

Reuse allows us to implement React components and aplications in a functional/reactive way, making it much more natural to deal with the asynchronicity of interfaces.

Think of all the data and events you're used to work with in React, such as props, state, lifecycle, user interaction, etc. These are all asynchronous by nature, the data change and the events emit along time, more than often triggered by previous events and producing new ones. Basicaly what Reuse does is to turn all of this data and events into reactive streams, completely embracing the asynchronicity and allowing us to take advantage of it.

## Component's Structure

A Reuse component is a function which receives a `sources` object and returns a `sinks` object. The `sources` is how we access the streams from the React side - props, state, lifecycle, etc. The `sinks` is how we describe our component behaviour.

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

Now our component is implemented, we must use Reuse to convert it to a conventional React component:

```typescript
import ReactDOM from 'react-dom'
import reuse from 'reuse'

const main = (sources) => ({
  view: (viewArgs) =>
    <div>
      <p>Hello World</p>
    </div>
})

const HelloWorld = reuse(main)

ReactDOM.render(
  <HelloWorld />,
  document.getElementById('app')
)
```