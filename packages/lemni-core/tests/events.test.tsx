import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import { Stream } from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import { lemni } from '../src'


interface State {
  count: number
}


const EventsComp = lemni<{}, State>(sources => {
  const increment = Stream.create<undefined>()
  const incrementBy = Stream.create<number>()

  return {
    initialState: {
      count: 0,
    },

    stateReducer: [
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
    ],

    view: ({ props, state, emitter }) => (
      <div>
        <p>Counter: {state.count}</p>
        <button className='increment' onClick={emitter(increment).emitValue(undefined)}>Increment</button>
        <button className='incrementBy2' onClick={emitter(incrementBy).emitValue(2)}>Increment by 2</button>
        <IncrementButton by={3} onClick={emitter(incrementBy).emit} />
      </div>
    )
  }
})


interface IncrementProps {
  by: number
  onClick: (v: number) => void
}


const IncrementButton = lemni<IncrementProps>(sources => {
  const onClickEvent = Stream.create<undefined>()

  return {
    sideEffect: [
      onClickEvent
        .compose(sampleCombine(
          sources.props
        ))
        .map(([_1, _2]) => _2)
        .map(({ by, onClick }) =>
          () => {
            onClick(by)
          }
        ),
    ],

    view: ({ props, state, emitter }) => (
      <button onClick={emitter(onClickEvent).emitValue(undefined)} />
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

  wrapper.find(IncrementButton).simulate('click')
  expect(wrapper.find('p').text()).toBe('Counter: 6')
})
