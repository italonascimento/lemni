import { mount } from 'enzyme'
import * as React from 'react'
import { spy } from 'sinon'
import ReactLifecycle from '../src/react-lifecycle'
import reuse from '../src/reuse'

const spies = {
  [ReactLifecycle.componentWillMount]: spy(),
  [ReactLifecycle.componentDidMount]: spy(),
  [ReactLifecycle.componentWillReceiveProps]: spy(),
  [ReactLifecycle.componentWillUpdate]: spy(),
  [ReactLifecycle.componentDidUpdate]: spy(),
  [ReactLifecycle.componentWillUnmount]: spy(),
}

const LifecycleComp = reuse(sources => ({
  sideEffect: sources.lifecycle
    .map(lifecycle =>
      () => {
        if (spies[lifecycle]) {
          spies[lifecycle]()
        }
      }
    ),

  view: () => null
}))

test('Lifecycle', () => {
  const wrapper = mount((<LifecycleComp />))

  expect(spies[ReactLifecycle.componentWillMount].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentDidMount].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentWillReceiveProps].callCount).toBe(0)
  expect(spies[ReactLifecycle.componentWillUpdate].callCount).toBe(0)
  expect(spies[ReactLifecycle.componentDidUpdate].callCount).toBe(0)
  expect(spies[ReactLifecycle.componentWillUnmount].callCount).toBe(0)

  wrapper.setProps({
    test: true
  })

  expect(spies[ReactLifecycle.componentWillMount].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentDidMount].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentWillReceiveProps].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentWillUpdate].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentDidUpdate].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentWillUnmount].callCount).toBe(0)

  wrapper.unmount()

  expect(spies[ReactLifecycle.componentWillMount].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentDidMount].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentWillReceiveProps].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentWillUpdate].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentDidUpdate].callCount).toBe(1)
  expect(spies[ReactLifecycle.componentWillUnmount].callCount).toBe(1)
})
