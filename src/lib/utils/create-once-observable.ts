/** @format */

export const createOnceObservable = () => {
    let consumer: null | (() => void) = null;
    return {
        emit: () => consumer?.(),
        subscribe: (subscriber: () => void) => {
            consumer = subscriber;
        },
    };
};
