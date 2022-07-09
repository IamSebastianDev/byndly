/** @format */

export const createObservable = () => {
    const subscribers = [];
    const subscribe = (action) => subscribers.push(action);
    const update = () => subscribers.forEach((sub) => sub());
    return { subscribe, update };
};
