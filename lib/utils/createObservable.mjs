/** @format */

export const createObservable = () => {
    let subscribers = [];
    const subscribe = (action) => subscribers.push(action);
    const update = () => subscribers.forEach((sub) => sub());
    const reset = () => (subscribers = []);
    return { subscribe, update, reset };
};
