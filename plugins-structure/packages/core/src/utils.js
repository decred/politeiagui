import { store as defaultStore } from "./storeSetup";
import QRCode from "qrcode";

/**
 * Function that receives an array of objects of the format { key, reducer }
 * and injects the reducers in the store.
 * This is an easy way to inject multiple reducers with a single line of code.
 */
export async function connectReducers(reducersArray, store = defaultStore) {
  await Object.values(reducersArray).forEach(async ({ key, reducer }) => {
    await store.injectReducer(key, reducer);
  });
}

export async function generateQrCode(code) {
  return await QRCode.toDataURL(code, { margin: 0 });
}
