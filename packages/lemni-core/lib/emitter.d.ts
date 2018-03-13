import { Stream } from 'xstream';
export declare type Emitter = <T>(stream: Stream<T | undefined>) => {
    emit: (value: T) => void;
    emitValue: (value: T) => () => void;
    signal: () => void;
};
export declare const Emitter: Emitter;
