import reducer, { initialState, userLogin } from "./userAuthSlice";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "../../client";

describe("Given the userAuthSlice", () => {
  let store;
  // spy on the method used to fetch
  let userLoginSpy;
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          // This will make the client available in the 'extra' argument
          // for all our thunks created with createAsyncThunk
          thunk: {
            extraArgument: client,
          },
        }),
    });
    userLoginSpy = jest.spyOn(client, "userLogin");
  });
  afterEach(() => {
    userLoginSpy.mockRestore();
  });

  describe("when empty params", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  describe("when userLogin is dispatched with invalid params", () => {
    it("should not fetch nor fire actions", async () => {
      const badArgs = [
        null,
        undefined,
        { email: "email" },
        { password: "pass" },
      ];
      for (const badArg of badArgs) {
        await store.dispatch(userLogin(badArg));
        expect(userLoginSpy).not.toHaveBeenCalled();
        expect(store.getState().status).toEqual("idle");
      }
    });
  });
});
