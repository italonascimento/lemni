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
import lemni from 'lemni'

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

## Docs

https://italonascimento.github.io/lemni/

Also available on dat protocol for [Beaker Browser](https://beakerbrowser.com) enthusiasts (as we all should be):

dat://761cafc1cf4964ddf8ae5c55af08d57ea99d5ba3cdd3da4ce3f802802c5597ac/

## License

MIT