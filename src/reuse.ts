import * as PropTypes from 'prop-types'
import { Component, ComponentClass } from 'react'
import { Listener, Stream } from 'xstream'
import ReactLifecycle, { ReactLifecycleName } from './react-lifecycle'

export type ReuseMainFn<P, S, St> =
  (sources: ReuseSources<P, S, St>) => ReuseSinks<P, S, St>

export interface ReuseSources<P, S, St> {
  props: Stream<P>
  state: Stream<S>
  store: Stream<St>
  lifecycle: Stream<ReactLifecycleName>
}

export type ReducerFn<T> = (t: T) => T

export interface ReuseSinks<P, S, St> {
  initialState?: S
  stateReducer?: Stream<ReducerFn<S>>
  storeReducer?: Stream<ReducerFn<St>>
  view: (p: P, s: S) => JSX.Element | null | false
  sideEffect?: Stream<() => void>
}

const reuse = <P = {}, S = {}, St = {}>(mainFn: ReuseMainFn<P, S, St>) => {
  class ReactComponent extends Component<P, S> {

    static contextTypes = {
      store: PropTypes.object,
    }

    private sources: ReuseSources<P, S, St>
    private sinks: ReuseSinks<P, S, St>

    private stateListener: Partial<Listener<S>>
    private storeReducerListener: Partial<Listener<ReducerFn<St>>>
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
        initialState = {} as S
      } = this.sinks

      this.setState(initialState)

      if (stateReducer) {
        const state = stateReducer.fold(
          (lastState, reduce) =>
            reduce(lastState),
          initialState
        )

        this.sources.state.imitate(state.filter(v => !!v))

        this.stateListener = { next: (s: S) => this.setState(s) }
        this.sources.state.addListener(this.stateListener)
      }

      if (storeReducer && hasStore) {
        this.storeReducerListener = {
          next: (reducer: ReducerFn<St>) =>
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
      return this.sinks.view(this.props, this.state)
    }
  }

  return ReactComponent as ComponentClass<P>
}

export default reuse
