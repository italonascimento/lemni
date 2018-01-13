import * as React from 'react'
import xs from 'xstream'
import reuse from '../src/reuse'

interface State {
  helloTo: string
}

const Hello = reuse<{}, State>(
  (sources) => ({
    initialState: {
      helloTo: 'nobody',
    },

    stateReducer: xs.of((state: State) => ({
      helloTo: 'world'
    })),

    view: (props, state) => (
      <div>
        Hello {state.helloTo}!
      </div>
    )
  })
)

export default Hello
