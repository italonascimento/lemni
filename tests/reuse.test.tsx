import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import Hello from './Hello'

test('State reducer', () => {
  const hello = mount((<Hello />))

  expect(hello.text()).toContain('Hello world!')

  expect(hello).toMatchSnapshot()
})
