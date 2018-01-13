import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import { ReactLifecycleName } from '../src/react-lifecycle'
import ReactLifecycle from '../src/react-lifecycle'
import reuse from '../src/reuse'

interface State {
  triggeredLifecycle?: string
}

const Lifecycle = reuse<{}, State>(sources => ({
  stateReducer: sources.lifecycle
    .filter(lifecycle => lifecycle === ReactLifecycle.componentDidMount)
    .map(triggeredLifecycle => (state: State) => ({
      triggeredLifecycle,
    })),

  view: (props, state) => (
    <div>
      {state.triggeredLifecycle}
    </div>
  )
}))

test('Lifecycle', () => {
  const lifecycle = mount((<Lifecycle />))

  // TODO: test other lifecycles
  expect(lifecycle.text()).toContain('componentDidMount')

  expect(lifecycle).toMatchSnapshot()
})
