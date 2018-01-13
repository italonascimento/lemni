import { Component, ComponentClass } from 'react'
import { Stream } from 'xstream'

export type ReuseMainFn<P, S, St> =
  (sources: ReuseSources<P, S, St>) => ReuseSinks<P, S, St>

export interface ReuseSources<P, S, St> {
  props: Stream<P>
  state: Stream<S>
  store: Stream<St>
}

export type ReducerFn<T> = (t: T) => T

export interface ReuseSinks<P, S, St> {
  initialState: S
  stateReducer?: Stream<ReducerFn<S>>
  storeReducer?: Stream<ReducerFn<St>>
  view: (p: P, s: S) => JSX.Element
}

const reuse = <P = {}, S = {}, St = {}>(mainFn: ReuseMainFn<P, S, St>) => {
  class ReactComponent extends Component<P, S> {
    private sources: ReuseSources<P, S, St>
    private sinks: ReuseSinks<P, S, St>

    componentWillMount() {
      this.sources = {
        props: Stream.create(),
        state: Stream.create(),
        store: Stream.create(),
      }

      this.sinks = mainFn(this.sources)

      const {stateReducer, storeReducer, initialState} = this.sinks

      this.setState(initialState)

      if (stateReducer) {
        const state = stateReducer.fold(
          (lastState, reduce) =>
            reduce(lastState),
          initialState
        )

        this.sources.state.imitate(state.filter(v => !!v))

        state.addListener({
          next: s => this.setState(s)
        })
      }

      if (storeReducer && this.context && this.context.store) {
        // TODO
      }
    }

    render() {
      return this.sinks.view(this.props, this.state)
    }
  }

  return ReactComponent as ComponentClass<P>
}

export default reuse
