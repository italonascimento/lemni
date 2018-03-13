import * as PropTypes from 'prop-types';
import { Component } from 'react';
import { Stream } from 'xstream';
import { Emitter } from './emitter';
export const lemni = (mainFn) => {
    class ReactComponent extends Component {
        componentWillMount() {
            const hasStore = this.context && this.context.store;
            this.sources = {
                props: Stream.create(),
                state: Stream.create(),
                store: hasStore ? this.context.store.getStoreStream() : Stream.never(),
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
                    next: (reducer) => this.context.store.sendNextReducer(reducer)
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
            this.sources.props.shamefullySendNext(this.props);
            this.sources.lifecycle.componentDidUpdate.shamefullySendNext(undefined);
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
            return this.sinks.view
                ? this.sinks.view({
                    props: this.props,
                    state: this.state,
                    emitter: Emitter
                })
                : null;
        }
    }
    ReactComponent.contextTypes = {
        store: PropTypes.object,
    };
    return ReactComponent;
};
//# sourceMappingURL=lemni.js.map