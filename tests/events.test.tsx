import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import { Stream } from 'xstream'
import xs from 'xstream'
import reuse from '../src/reuse'

interface State {
  count: number
}

const EventsComp = reuse<{}, State>(sources => {
  const increment = Stream.create<undefined>()
  const incrementBy = Stream.create<number>()

  return {
    initialState: {
      count: 0,
    },

    stateReducer: xs.merge(
      increment
        .mapTo((state: State) => ({
          count: state.count + 1
        })),

      incrementBy
        .map(
          value =>
            (state: State) => ({
              count: state.count + value
            })
        )
    ),

    view: (props, state, emitter) => (
      <div>
        <p>Counter: {state.count}</p>
        <button className='increment' onClick={emitter.signal(increment)}>Increment</button>
        <button className='incrementBy2' onClick={emitter.emitValue(2)(incrementBy)}>Increment by 2</button>
      </div>
    )
  }
})

test('Events', () => {
  const wrapper = mount((<EventsComp />))
  expect(wrapper.find('p').text()).toBe('Counter: 0')

  wrapper.find('.increment').simulate('click')
  expect(wrapper.find('p').text()).toBe('Counter: 1')

  wrapper.find('.incrementBy2').simulate('click')
  expect(wrapper.find('p').text()).toBe('Counter: 3')
})
