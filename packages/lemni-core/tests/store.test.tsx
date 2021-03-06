import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import { Stream } from 'xstream'
import { lemni } from '../src'
import { createStore } from '../src/createStore'
import { withStoreProvider } from '../src/withStoreProvider'


interface Store {
  count: number
}


interface State {
  count: number
}


const Comp = lemni<{}, State, Store>(sources => {
  const increment = Stream.create<undefined>()

  return {
    initialState: {
      count: 0,
    },

    stateReducer: [
      sources.store
        .map(store => () => ({
          count: store.count
        })),
    ],

    storeReducer: [
      increment
        .mapTo((store: Store) => ({
          count: store.count + 1
        })),
    ],

    view: ({ props, state, emitter }) => (
      <div>
        <p>Counter: {state.count}</p>
        <button
          className='increment'
          onClick={emitter(increment).emitValue(undefined)}
        >
          Increment
        </button>
      </div>
    )
  }
})

const globalStore = createStore<Store>({ count: 0 })
const CompWithStore = withStoreProvider(globalStore)(Comp)

test('Store', () => {
  const wrapper = mount((<CompWithStore />))
  expect(wrapper.find('p').text()).toBe('Counter: 0')

  wrapper.find('.increment').simulate('click')
  expect(wrapper.find('p').text()).toBe('Counter: 1')

  wrapper.find('.increment').simulate('click')
  expect(wrapper.find('p').text()).toBe('Counter: 2')
})
