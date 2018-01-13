import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import Hello from './Hello'

test('Hello', () => {
  let hello = mount((<Hello />))

  expect(hello.text()).toContain('Hello state')
  expect(hello.text()).toContain('Hello store')
  expect(hello.text()).not.toContain('Hello props')

  hello = mount((<Hello to='props' />))

  expect(hello.text()).toContain('Hello props')

  expect(hello).toMatchSnapshot()
})
