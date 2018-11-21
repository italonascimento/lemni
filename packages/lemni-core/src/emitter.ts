import { Stream } from 'xstream'


export type Emitter = <T>(stream: Stream<T>) => {
  emit:
  (value: T) =>
    void

  emitValue:
  (value: T) =>
    () =>
      void

  signal:
  () =>
    void
}


export const Emitter: Emitter = stream => ({
  emit:
    value =>
      stream.shamefullySendNext(value)
  ,
  emitValue:
    value =>
      () =>
        stream.shamefullySendNext(value)
  ,
  signal:
    () =>
      stream.shamefullySendNext(undefined!)
  ,
})
