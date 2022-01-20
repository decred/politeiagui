import { store } from "./storeSetup";

/**
 * Function that receives an array of objects of the format { key, reducer }
 * and injects the reducers in the store.
 * This is an easy way to inject multiple reducers with a single line of code.
 */
 export async function connectReducers(reducersArray) {
  await Object.values(reducersArray).forEach(async ({ key, reducer }) => {
    await store.injectReducer(key, reducer);
  });
}