import {
  Component,
  ComponentClass
} from 'react'
import xs, {
  Listener,
  Stream
} from 'xstream'
import { Reducer, Store } from './createStore'
import { Emitter } from './emitter'


export type LemniMainFunction<P, L, S> =
  (sourceStreams: SourceStreams<P, L, S>) =>
    Sinks<P, L, S>

export interface LifecycleSource {
  componentDidMount: Stream<undefined>
  componentWillUnmount: Stream<undefined>
  componentWillMount: Stream<undefined>
  componentWillReceiveProps: Stream<undefined>
  shouldComponentUpdate: Stream<undefined>
  componentWillUpdate: Stream<undefined>
  componentDidUpdate: Stream<undefined>
}

export interface SourceStreams<P, L, S> {
  props: Stream<P>
  state: Stream<L>
  store: Stream<S>
  lifecycle: LifecycleSource
}

export interface ViewSources<P, L> {
  props: P
  state: L
  emitter: typeof Emitter
}

// TODO: remove compatibility types and use only arrays
// in stateReducer, storeReducer and sideEffects
export interface Sinks<P, L, S> {
  initialState?: L
  stateReducer?: Array<Stream<Reducer<L>>> | Stream<Reducer<L>>
  storeReducer?: Array<Stream<Reducer<S>>> | Stream<Reducer<S>>
  view?:
  (viewSources: ViewSources<P, L>) =>
    JSX.Element | null | false
  sideEffect?: Array<Stream<() => void>> | Stream<() => void>
}

export interface WithStore<T> {
  store?: Store<T>
}

export const lemni = <P = {}, L = {}, S = {}>(mainFn: LemniMainFunction<P, L, S>) => {
  type PropsWithStore = WithStore<S> & P

  const propsWithoutStore = (propsWithStore: PropsWithStore) => {
    const { store, ...props } = propsWithStore as any
    return props as P
  }

  class ReactComponent extends Component<PropsWithStore, L> {

    private store: Store<S>
    private componentProps: P

    private sources: SourceStreams<P, L, S>
    private sinks: Sinks<P, L, S>
    private stateReducer: Stream<Reducer<L>>
    private storeReducer: Stream<Reducer<S>>
    private sideEffect: Stream<() => void>

    private stateListener: Partial<Listener<L>>
    private storeReducerListener: Partial<Listener<Reducer<S>>>
    private sideEffectListener: Partial<Listener<() => void>>


    componentWillMount() {
      // FIX ME: remove "as any"
      // Generic types can't be spread
      // https://github.com/Microsoft/TypeScript/issues/16780
      // https://github.com/Microsoft/TypeScript/issues/10727
      const { store, ...props } = this.props as any
      this.store = store as Store<S>
      this.componentProps = props as P

      const hasStore = Boolean(this.store)

      this.sources = {
        props: Stream.createWithMemory(),
        state: Stream.createWithMemory(),
        store: hasStore ? this.store.getStoreStream() : Stream.never(),
        lifecycle: {
          componentDidMount: Stream.create(),
          componentWillUnmount: Stream.create(),
          componentWillMount: Stream.create(),
          componentWillReceiveProps: Stream.create(),
          shouldComponentUpdate: Stream.create(),
          componentWillUpdate: Stream.create(),
          componentDidUpdate: Stream.create(),
        },
      }

      this.sinks = mainFn(this.sources)
      const {
        stateReducer = [],
        storeReducer = [],
        sideEffect = [],
        initialState = {} as L
      } = this.sinks

      // TODO: remove isArray checks and deprecation warning in next minor
      if (
        !Array.isArray(stateReducer) ||
        !Array.isArray(storeReducer) ||
        !Array.isArray(sideEffect)
      ) {
        console.warn(
          `[lemni] Passing a stream as stateReducer, storeReducer or sideEffect is \
deprected and will throw error starting from version v0.1.0. Use array of stream instead.`
        )
      }
      this.stateReducer = Array.isArray(stateReducer) ? xs.merge(...stateReducer) : stateReducer
      this.storeReducer = Array.isArray(storeReducer) ? xs.merge(...storeReducer) : storeReducer
      this.sideEffect = Array.isArray(sideEffect) ? xs.merge(...sideEffect) : sideEffect

      this.setState(initialState)

      if (stateReducer) {
        const state = this.stateReducer.fold(
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
            this.store.sendNextReducer(reducer)
        }

        this.storeReducer.addListener(this.storeReducerListener)
      }

      if (sideEffect) {
        this.sideEffectListener = {
          next: (effect: () => void) => effect()
        }

        this.sideEffect.addListener(this.sideEffectListener)
      }

      this.sources.lifecycle.componentWillMount.shamefullySendNext(undefined)
    }

    componentWillReceiveProps() {
      this.sources.lifecycle.componentWillReceiveProps.shamefullySendNext(undefined)
    }

    componentDidMount() {
      this.sources.lifecycle.componentDidMount.shamefullySendNext(undefined)
    }

    componentWillUpdate() {
      this.sources.lifecycle.componentWillUpdate.shamefullySendNext(undefined)
    }

    componentDidUpdate() {
      this.sources.lifecycle.componentDidUpdate.shamefullySendNext(undefined)
      this.sources.props.shamefullySendNext(this.componentProps)
    }

    componentWillUnmount() {
      this.sources.lifecycle.componentWillUnmount.shamefullySendNext(undefined)

      if (this.stateListener) {
        this.sources.state.removeListener(this.stateListener)
      }

      if (this.storeReducerListener) {
        this.storeReducer.removeListener(this.storeReducerListener)
      }

      if (this.sideEffectListener) {
        this.sideEffect.removeListener(this.sideEffectListener)
      }
    }

    render() {
      this.componentProps = propsWithoutStore(this.props as PropsWithStore)

      return this.sinks.view
        ? this.sinks.view({
          props: this.componentProps,
          state: this.state,
          emitter: Emitter,
        })
        : null
    }
  }


  return ReactComponent as ComponentClass<P>
}
