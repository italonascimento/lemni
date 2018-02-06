import * as PropTypes from 'prop-types'
import {
  Component,
  ComponentClass
} from 'react'
import {
  Listener,
  Stream
} from 'xstream'
import { Reducer } from './createStore'
import { Emitter } from './emitter'
import { ReactLifecycle } from './react-lifecycle'


export type ReuseMainFunction<P, L, S> =
  (sources: ReuseSources<P, L, S>) =>
    ReuseSinks<P, L, S>


export interface ReuseSources<P, L, S> {
  props: Stream<P>
  state: Stream<L>
  store: Stream<S>
  lifecycle: Stream<ReactLifecycle>
}


export interface ReuseSinks<P, L, S> {
  initialState?: L
  stateReducer?: Stream<Reducer<L>>
  storeReducer?: Stream<Reducer<S>>
  view:
    (p: P, s: L, e: typeof Emitter) =>
      JSX.Element | null | false
  sideEffect?: Stream<() => void>
}


export const reuse = <P = {}, L = {}, S = {}>(mainFn: ReuseMainFunction<P, L, S>) => {
  class ReactComponent extends Component<P, L> {

    static contextTypes = {
      store: PropTypes.object,
    }

    private sources: ReuseSources<P, L, S>
    private sinks: ReuseSinks<P, L, S>

    private stateListener: Partial<Listener<L>>
    private storeReducerListener: Partial<Listener<Reducer<S>>>
    private sideEffectListener: Partial<Listener<() => void>>

    componentWillMount() {
      const hasStore = this.context && this.context.store

      this.sources = {
        props: Stream.create(),
        state: Stream.create(),
        store: hasStore ? this.context.store.getStoreStream() : Stream.never(),
        lifecycle: Stream.create(),
      }

      this.sinks = mainFn(this.sources)
      const {
        stateReducer,
        storeReducer,
        sideEffect,
        initialState = {} as L
      } = this.sinks

      this.setState(initialState)

      if (stateReducer) {
        const state = stateReducer.fold(
          (lastState, reduce) =>
            reduce(lastState),
          initialState
        )

        this.sources.state.imitate(state.filter(v => !!v))

        this.stateListener = { next: (s: L) => this.setState(s) }
        this.sources.state.addListener(this.stateListener)
      }

      if (storeReducer && hasStore) {
        this.storeReducerListener = {
          next: (reducer: Reducer<S>) =>
            this.context.store.sendNextReducer(reducer)
        }

        storeReducer.addListener(this.storeReducerListener)
      }

      if (sideEffect) {
        this.sideEffectListener = {
          next: (effect: () => void) => effect()
        }

        sideEffect.addListener(this.sideEffectListener)
      }

      this.sources.lifecycle.shamefullySendNext(
        ReactLifecycle.componentWillMount
      )
    }

    componentWillReceiveProps() {
      this.sources.lifecycle.shamefullySendNext(
        ReactLifecycle.componentWillReceiveProps
      )
    }

    componentDidMount() {
      this.sources.lifecycle.shamefullySendNext(
        ReactLifecycle.componentDidMount
      )
    }

    componentWillUpdate() {
      this.sources.lifecycle.shamefullySendNext(
        ReactLifecycle.componentWillUpdate
      )
    }

    componentDidUpdate() {
      this.sources.props.shamefullySendNext(this.props)

      this.sources.lifecycle.shamefullySendNext(
        ReactLifecycle.componentDidUpdate
      )
    }

    componentWillUnmount() {
      this.sources.lifecycle.shamefullySendNext(
        ReactLifecycle.componentWillUnmount
      )

      if (this.stateListener) {
        this.sources.state.removeListener(this.stateListener)
      }

      if (this.storeReducerListener) {
        this.sinks.storeReducer!.removeListener(this.storeReducerListener)
      }

      if (this.sideEffectListener) {
        this.sinks.sideEffect!.removeListener(this.sideEffectListener)
      }
    }

    render() {
      return this.sinks.view(this.props, this.state, Emitter)
    }
  }


  return ReactComponent as ComponentClass<P>
}
