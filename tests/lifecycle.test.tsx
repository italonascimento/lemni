import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import { Stream } from 'xstream'
import ReactLifecycle from '../src/react-lifecycle'
import reuse from '../src/reuse'

interface Props {
  breakLine?: boolean
}

interface State {
  triggeredLifecycle?: string
}

const createComponent = (lifecycleName: string) => reuse<Props, State>(sources => ({
  stateReducer: sources.lifecycle
    .filter(lifecycle => lifecycle === lifecycleName)
    .take(1)
    .map(triggeredLifecycle => (state: State) => ({
      triggeredLifecycle,
    })),

  view: (props, state) => (
    <div>
      {(
        props.breakLine
      ) && (
        <br />
      )}
      {state.triggeredLifecycle}
    </div>
  )
}))

const WillMount = createComponent(ReactLifecycle.componentWillMount)
const DidMount = createComponent(ReactLifecycle.componentDidMount)
const WillReceiveProps = createComponent(ReactLifecycle.componentWillReceiveProps)
const WillUpdate = createComponent(ReactLifecycle.componentWillUpdate)
const DidUpdate = createComponent(ReactLifecycle.componentDidUpdate)

test('Lifecycle', () => {
  const willMount = mount((<WillMount />))
  expect(willMount.text()).toContain(ReactLifecycle.componentWillMount)

  const didMount = mount((<DidMount />))
  expect(didMount.text()).toContain(ReactLifecycle.componentDidMount)

  const willReceiveProps = mount((<WillReceiveProps />))
  willReceiveProps.setProps({
    breakLine: true
  })
  expect(willReceiveProps.text()).toContain(ReactLifecycle.componentWillReceiveProps)

  const willUpdate = mount((<WillUpdate />))
  willUpdate.setProps({
    breakLine: true
  })
  expect(willUpdate.text()).toContain(ReactLifecycle.componentWillUpdate)

  const didUpdate = mount((<DidUpdate />))
  didUpdate.setProps({
    breakLine: true
  })
  expect(didUpdate.text()).toContain(ReactLifecycle.componentDidUpdate)
})
