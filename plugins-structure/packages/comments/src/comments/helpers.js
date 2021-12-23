import { store } from "@politeiagui/core";

export function checkReducersDeps(reducers) {
  reducers.forEach((reducerName) => {
    if (Object.keys(store.asyncReducers).indexOf(reducerName) === -1) {
      throw new Error(`${reducerName} reducer is missing on store`);
    }
  });
}
