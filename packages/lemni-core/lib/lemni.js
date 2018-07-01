var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { Component } from 'react';
import { Stream } from 'xstream';
import { Emitter } from './emitter';
export const lemni = (mainFn) => {
    const propsWithoutStore = (propsWithStore) => {
        const _a = propsWithStore, { store } = _a, props = __rest(_a, ["store"]);
        return props;
    };
    class ReactComponent extends Component {
        componentWillMount() {
            // FIX ME: remove "as any"
            // Generic types can't be spread
            // https://github.com/Microsoft/TypeScript/issues/16780
            // https://github.com/Microsoft/TypeScript/issues/10727
            const _a = this.props, { store } = _a, props = __rest(_a, ["store"]);
            this.store = store;
            this.componentProps = props;
            const hasStore = Boolean(this.store);
            this.sources = {
                props: Stream.create(),
                state: Stream.create(),
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
            };
            this.sinks = mainFn(this.sources);
            const { stateReducer, storeReducer, sideEffect, initialState = {} } = this.sinks;
            this.setState(initialState);
            if (stateReducer) {
                const state = stateReducer.fold((lastState, reduce) => reduce(lastState), initialState);
                this.sources.state.imitate(state.filter(v => !!v));
                this.stateListener = { next: (s) => this.setState(s) };
                this.sources.state.addListener(this.stateListener);
            }
            if (storeReducer && hasStore) {
                this.storeReducerListener = {
                    next: (reducer) => this.store.sendNextReducer(reducer)
                };
                storeReducer.addListener(this.storeReducerListener);
            }
            if (sideEffect) {
                this.sideEffectListener = {
                    next: (effect) => effect()
                };
                sideEffect.addListener(this.sideEffectListener);
            }
            this.sources.lifecycle.componentWillMount.shamefullySendNext(undefined);
        }
        componentWillReceiveProps() {
            this.sources.lifecycle.componentWillReceiveProps.shamefullySendNext(undefined);
        }
        componentDidMount() {
            this.sources.lifecycle.componentDidMount.shamefullySendNext(undefined);
        }
        componentWillUpdate() {
            this.sources.lifecycle.componentWillUpdate.shamefullySendNext(undefined);
        }
        componentDidUpdate() {
            this.sources.lifecycle.componentDidUpdate.shamefullySendNext(undefined);
            this.sources.props.shamefullySendNext(this.componentProps);
        }
        componentWillUnmount() {
            this.sources.lifecycle.componentWillUnmount.shamefullySendNext(undefined);
            if (this.stateListener) {
                this.sources.state.removeListener(this.stateListener);
            }
            if (this.storeReducerListener) {
                this.sinks.storeReducer.removeListener(this.storeReducerListener);
            }
            if (this.sideEffectListener) {
                this.sinks.sideEffect.removeListener(this.sideEffectListener);
            }
        }
        render() {
            this.componentProps = propsWithoutStore(this.props);
            return this.sinks.view
                ? this.sinks.view({
                    props: this.componentProps,
                    state: this.state,
                    emitter: Emitter
                })
                : null;
        }
    }
    return ReactComponent;
};
//# sourceMappingURL=lemni.js.map