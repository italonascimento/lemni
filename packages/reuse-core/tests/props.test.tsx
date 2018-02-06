import { shallow } from 'enzyme'
import 'jest'
import * as React from 'react'
import { reuse } from '../src'


interface Props {
  to: string
}


const Hello = reuse<Props>(() => ({
  view: ({props}) => (
    <div>Hello { props.to }</div>
  )
}))

test('Props', () => {
  const wrapper = shallow((<Hello to='Joe' />))
  expect(wrapper.text()).toBe('Hello Joe')

  wrapper.setProps({
    to: 'Joane'
  })
  expect(wrapper.text()).toBe('Hello Joane')
})
