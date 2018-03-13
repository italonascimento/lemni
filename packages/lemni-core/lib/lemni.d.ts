/// <reference types="react" />
import { ComponentClass } from 'react';
import { Stream } from 'xstream';
import { Reducer } from './createStore';
import { Emitter } from './emitter';
export declare type LemniMainFunction<P, L, S> = (sourceStreams: SourceStreams<P, L, S>) => Sinks<P, L, S>;
export interface LifecycleSource {
    componentDidMount: Stream<undefined>;
    componentWillUnmount: Stream<undefined>;
    componentWillMount: Stream<undefined>;
    componentWillReceiveProps: Stream<undefined>;
    shouldComponentUpdate: Stream<undefined>;
    componentWillUpdate: Stream<undefined>;
    componentDidUpdate: Stream<undefined>;
}
export interface SourceStreams<P, L, S> {
    props: Stream<P>;
    state: Stream<L>;
    store: Stream<S>;
    lifecycle: LifecycleSource;
}
export interface ViewSources<P, L> {
    props: P;
    state: L;
    emitter: typeof Emitter;
}
export interface Sinks<P, L, S> {
    initialState?: L;
    stateReducer?: Stream<Reducer<L>>;
    storeReducer?: Stream<Reducer<S>>;
    view?: (viewSources: ViewSources<P, L>) => JSX.Element | null | false;
    sideEffect?: Stream<() => void>;
}
export declare const lemni: <P = {}, L = {}, S = {}>(mainFn: LemniMainFunction<P, L, S>) => ComponentClass<P>;
