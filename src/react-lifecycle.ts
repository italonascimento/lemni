export type ReactLifecycleName =
  'componentWillMount' |
  'componentDidMount' |
  'componentWillReceiveProps' |
  'shouldComponentUpdate' |
  'componentWillUpdate' |
  'componentDidUpdate' |
  'componentWillUnmount'

const ReactLifecycle: {[key: string]: ReactLifecycleName} = {
  componentDidMount: 'componentDidMount',
  componentWillUnmount: 'componentWillUnmount',
  componentWillMount: 'componentWillMount',
  componentWillReceiveProps: 'componentWillReceiveProps',
  shouldComponentUpdate: 'shouldComponentUpdate',
  componentWillUpdate: 'componentWillUpdate',
  componentDidUpdate: 'componentDidUpdate',
}

export default ReactLifecycle
