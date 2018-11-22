import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import { spy } from 'sinon'
import { lemni } from '../src'


const componentWillMount = spy()
const componentDidMount = spy()
const componentWillReceiveProps = spy()
const componentWillUpdate = spy()
const componentDidUpdate = spy()
const componentWillUnmount = spy()

const LifecycleComp = lemni(sources => ({
  sideEffect: [
    sources.lifecycle.componentWillMount
      .mapTo(() => componentWillMount()),
    sources.lifecycle.componentDidMount
      .mapTo(() => componentDidMount()),
    sources.lifecycle.componentWillReceiveProps
      .mapTo(() => componentWillReceiveProps()),
    sources.lifecycle.componentWillUpdate
      .mapTo(() => componentWillUpdate()),
    sources.lifecycle.componentDidUpdate
      .mapTo(() => componentDidUpdate()),
    sources.lifecycle.componentWillUnmount
      .mapTo(() => componentWillUnmount()),
  ]
}))

test('Lifecycle', () => {
  const wrapper = mount((<LifecycleComp />))

  expect(componentWillMount.callCount).toBe(1)
  expect(componentDidMount.callCount).toBe(1)
  expect(componentWillReceiveProps.callCount).toBe(0)
  expect(componentWillUpdate.callCount).toBe(0)
  expect(componentDidUpdate.callCount).toBe(0)
  expect(componentWillUnmount.callCount).toBe(0)

  wrapper.setProps({
    test: true
  })

  expect(componentWillMount.callCount).toBe(1)
  expect(componentDidMount.callCount).toBe(1)
  expect(componentWillReceiveProps.callCount).toBe(1)
  expect(componentWillUpdate.callCount).toBe(1)
  expect(componentDidUpdate.callCount).toBe(1)
  expect(componentWillUnmount.callCount).toBe(0)

  wrapper.unmount()

  expect(componentWillMount.callCount).toBe(1)
  expect(componentDidMount.callCount).toBe(1)
  expect(componentWillReceiveProps.callCount).toBe(1)
  expect(componentWillUpdate.callCount).toBe(1)
  expect(componentDidUpdate.callCount).toBe(1)
  expect(componentWillUnmount.callCount).toBe(1)
})
