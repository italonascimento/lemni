import { Stream } from 'xstream';
export declare type Reducer<T> = (value: T) => T;
export interface Store<T> {
    getStoreStream: () => Stream<T>;
    sendNextReducer: (reducer: Reducer<T>) => void;
}
export declare function createStore<T>(initialStore: T): Store<T>;
