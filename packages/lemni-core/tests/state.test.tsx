import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import { Stream } from 'xstream'
import xs from 'xstream'
import { lemni } from '../src'


interface State {
  count: number
}


const StateComp = lemni<{}, State>(() => {
  const increment = Stream.create<undefined>()

  return {
    initialState: {
      count: 0,
    },

    stateReducer: xs.merge(
      increment
        .mapTo((state: State) => ({
          count: state.count + 1
        })),
    ),

    view: ({props, state, emitter}) => (
      <div>
        <p>Counter: { state.count }</p>
        <button className='increment' onClick={ emitter(increment).signal }>Increment</button>
      </div>
    )
  }
})

test('State', () => {
  const wrapper = mount((<StateComp />))
  expect(wrapper.find('p').text()).toBe('Counter: 0')

  wrapper.find('.increment').simulate('click')
  expect(wrapper.find('p').text()).toBe('Counter: 1')

  wrapper.find('.increment').simulate('click')
  expect(wrapper.find('p').text()).toBe('Counter: 2')
})
