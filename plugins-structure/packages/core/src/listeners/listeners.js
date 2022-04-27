import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

const listener = createListenerMiddleware();

export const listenerMiddleware = listener.middleware;

export function addStoreEffect(fn, actionCreators) {
  let actionsCalled = 0;
  listener.startListening({
    effect: (action, listenerApi) => {
      if (actionsCalled === actionCreators.length - 1) {
        return fn(action, listenerApi);
      } else {
        actionsCalled++;
      }
    },
    matcher: isAnyOf(...actionCreators),
  });
}
