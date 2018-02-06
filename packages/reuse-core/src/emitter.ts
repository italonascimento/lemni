import { Stream } from 'xstream'


export interface Emitter {
  emit:
    <T>(stream: Stream<T>) =>
      (value: T) =>
        void

  emitValue:
    <T>(value: T) =>
      (stream: Stream<T>) =>
        () =>
          void

  signal:
    (stream: Stream<undefined>) =>
      () =>
        void
}


export const Emitter: Emitter = {
  emit:
    stream =>
      value =>
        stream.shamefullySendNext(value)
  ,
  emitValue:
    value =>
      stream =>
        () =>
          stream.shamefullySendNext(value)
  ,
  signal:
    stream =>
      () =>
        stream.shamefullySendNext(undefined)
  ,
}
