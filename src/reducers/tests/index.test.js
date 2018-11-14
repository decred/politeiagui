import rootReducer from "../index";
import { createStore } from "redux";
import form from "../form";
import app from "../app";
import api from "../api";
import modal from "../modal";
import external_api from "../external_api";

describe("test reducers combination on index", () => {
  // smoke test for root reducer
  test("checking if all reducers needed are being combined", () => {
    const store = createStore(rootReducer);

    // checks if the default state returned by a reducer on rootReducer
    // is equal to the direct return of that reducer
    expect(store.getState().app).toEqual(app(undefined, {}));

    expect(store.getState().api).toEqual(api(undefined, {}));

    expect(store.getState().external_api).toEqual(external_api(undefined, {}));

    expect(store.getState().form).toEqual(form(undefined, {}));

    expect(store.getState().modal).toEqual(modal(undefined, {}));
  });
});
