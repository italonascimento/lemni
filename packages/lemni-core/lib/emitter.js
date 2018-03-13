export const Emitter = stream => ({
    emit: value => stream.shamefullySendNext(value),
    emitValue: value => () => stream.shamefullySendNext(value),
    signal: () => stream.shamefullySendNext(undefined),
});
//# sourceMappingURL=emitter.js.map