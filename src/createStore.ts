import { Stream } from 'xstream'

export type ReducerFn<T> = (value: T) => T

export interface Store<T> {
  getStoreStream: () => Stream<T>
  sendNextReducer: (reducerFn: ReducerFn<T>) => void
}

function createStore <T>(initialStore: T): Store<T> {
  const reducer: Stream<ReducerFn<T>> = Stream.create()
  const store = reducer.fold((lastStore: T, reduce: ReducerFn<T>) =>
    reduce(lastStore),
    initialStore,
  )

  return {
    getStoreStream: () => store,
    sendNextReducer: (reducerFn) => { reducer.shamefullySendNext(reducerFn) }
  }
}

export default createStore
