import * as React from 'react'
import xs from 'xstream'
import createStore from '../src/createStore'
import reuse from '../src/reuse'
import withStoreProvider from '../src/withStoreProvider';


export interface Props {
  to?: string
}

interface State {
  to?: string
  storeTo?: string
}

interface Store {
  to?: string
}

const globalStore = createStore<Store>({})

const Hello = reuse<Props, State, Store>(sources => ({
  stateReducer: xs.merge(
    xs.of((state: State) => ({
      to: 'state'
    })),

    sources.store
      .map(s => s.to)
      .filter(to => !!to)
      .map(storeTo => (state: State) => ({
        ...state,
        storeTo,
      }))
  ),

  storeReducer: xs.of((store: Store) => ({
    to: 'store'
  })),

  view: (props, state) => (
    <div>
      {(
        props.to
      ) && (
        <p>Hello {props.to}!</p>
      )}

      {(
        state.to
      ) && (
        <p>Hello {state.to}!</p>
      )}

      {(
        state.storeTo
      ) && (
        <p>Hello {state.storeTo}!</p>
      )}
    </div>
  )
}))

export default withStoreProvider(globalStore)(Hello)
