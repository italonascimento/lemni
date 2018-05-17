# Lemni

Lemni allows us to implement React components and aplications in a **functional and reactive** way, making it much more natural to deal with the asynchronicity of interfaces, as well as isolating side effects away from the actual implementation.

## Installation

You may install Lemni through npm or Yarn:

```bash
npm i @lemni/core

# or

yarn add @lemni/core
```

## Hello World

Lemni creates conventional React components, fully compatible with the entire React ecosystem, including **React Native**.

```typescript
import ReactDOM from 'react-dom'
import { lemni } from 'lemni'

const HelloWorld = lemni(
  sources => ({
    view: (viewArgs) =>
      <div>
        <p>Hello World</p>
      </div>
  })
)

ReactDOM.render(
  <HelloWorld />,
  document.getElementById('app')
)
```

## Basic Component

```typescript
import { lemni } from 'lemni'
import xs from 'xstream'

const Incrementer = lemni(sources => {
  const onIncrement = xs.Stream.create()

  return {
    initialState: {
      count: 0,
    },

    stateReducer: onIncrement.mapTo(
      state => ({
        count: state.count + 1,
      })
    ),

    view: ({ state, emitter }) => (
      <p>Count: {state.count}</p>
      <button onClick={emmiter(onIncrement).emit}>
        Increment
      </button>
    )
  }
})
```

## Docs

To better understand the above example and to see what else Lemni is capable of, head to the docs:

https://italonascimento.github.io/lemni/

## License

MIT