import { Stream } from 'xstream'


export type Reducer<T> =
  (value: T) =>
    T


export interface Store<T> {
  getStoreStream:
    () =>
      Stream<T>

  sendNextReducer:
    (reducer: Reducer<T>) =>
      void
}


export function createStore<T>(initialStore: T): Store<T> {
  const reducer = Stream.createWithMemory<Reducer<T>>()

  const accumulate =
    (lastStore: T, reduce: Reducer<T>) =>
      reduce(lastStore)

  const store =
    reducer.fold(
      accumulate,
      initialStore,
    )

  return {
    getStoreStream: () => store,
    sendNextReducer: next => reducer.shamefullySendNext(next),
  }
}
