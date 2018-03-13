import { Stream } from 'xstream';
export function createStore(initialStore) {
    const reducer = Stream.create();
    const accumulate = (lastStore, reduce) => reduce(lastStore);
    const store = reducer.fold(accumulate, initialStore);
    return {
        getStoreStream: () => store,
        sendNextReducer: next => reducer.shamefullySendNext(next),
    };
}
//# sourceMappingURL=createStore.js.map