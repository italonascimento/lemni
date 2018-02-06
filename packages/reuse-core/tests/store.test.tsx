import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import { Stream } from 'xstream'
import createStore from '../src/createStore'
import reuse from '../src/reuse'
import withStoreProvider from '../src/withStoreProvider'


interface Store {
  count: number
}


interface State {
  count: number
}


const Comp = reuse<{}, State, Store>(sources => {
  const increment = Stream.create<undefined>()

  return {
    initialState: {
      count: 0,
    },

    stateReducer: sources.store
      .map(store => (state: State) => ({
        count: store.count
      })),

    storeReducer: increment
      .mapTo((store: Store) => ({
        count: store.count + 1
      })),

    view: (props, state, emitter) => (
      <div>
        <p>Counter: { state.count }</p>
        <button
          className='increment'
          onClick={ emitter.signal(increment) }
        >
          Increment
        </button>
      </div>
    )
  }
})

const globalStore = createStore<Store>({ count: 0 })
const CompWithStore = withStoreProvider(globalStore)(Comp)

test('Events', () => {
  const wrapper = mount((<CompWithStore/>))
  expect(wrapper.find('p').text()).toBe('Counter: 0')

  wrapper.find('.increment').simulate('click')
  expect(wrapper.find('p').text()).toBe('Counter: 1')

  wrapper.find('.increment').simulate('click')
  expect(wrapper.find('p').text()).toBe('Counter: 2')
})
