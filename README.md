# Reuse

Reuse allows us to implement React components and aplications in a **functional and reactive** way, making it much more natural to deal with the asynchronicity of interfaces, as well as isolating side effects away from the actual implementation.

## Installation

You may install Reuse through npm or Yarn:

```bash
npm i @reuse/core

# or

yarn add @reuse/core
```

## Hello World

Reuse creates conventional React components, fully compatible with the entire React ecosystem, including **React Native**.

```typescript
import ReactDOM from 'react-dom'
import reuse from 'reuse'

const HelloWorld = reuse(
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

## Docs

https://italonascimento.github.io/reuse/

Also available on dat protocol for [Beaker Browser](https://beakerbrowser.com) enthusiasts (as we all should be):

dat://761cafc1cf4964ddf8ae5c55af08d57ea99d5ba3cdd3da4ce3f802802c5597ac/

## License

MIT