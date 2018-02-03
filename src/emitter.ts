import { Stream } from 'xstream'

const Emitter = {
  emit: <T>(stream: Stream<T>) =>
    (value: T) => stream.shamefullySendNext(value),

  emitValue: <T>(value: T) =>
    (stream: Stream<T>) =>
      () => stream.shamefullySendNext(value),

  signal: (stream: Stream<undefined>) =>
    () => stream.shamefullySendNext(undefined),
}

export default Emitter
