import reducer, { fetchUserDetails, initialState } from "./usersSlice";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "../../client/client";

describe("Given the usersSlice", () => {
  let store;
  // Methods used to fetch
  let userFetchDetailsSpy;
  beforeEach(() => {
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
    userFetchDetailsSpy = jest.spyOn(client, "userFetchDetails");
  });
  afterEach(() => {
    userFetchDetailsSpy.mockRestore();
  });
  describe("when empty params", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  describe("fetchUserDetails", () => {
    describe("when dispatched with invalid params", () => {
      it("should not fetch nor fire actions", async () => {
        const badArgs = [
          null,
          undefined,
          {},
          { userid: null },
          { userid: undefined },
          { userid: "" },
        ];
        await Promise.all(
          badArgs.map(async (args) => {
            await store.dispatch(fetchUserDetails(args));
            expect(userFetchDetailsSpy).not.toHaveBeenCalled();
            expect(store.getState().status).toEqual("idle");
          })
        );
      });
    });
    describe("when dispatched with valid params", () => {
      it("should update status to loading", () => {
        store.dispatch(fetchUserDetails("1234"));
        expect(store.getState().status).toEqual("loading");
      });
      it("should update status to succeeded and users by id", async () => {
        const userid = "1234";
        const userDetails = { userid, name: "John Doe" };
        userFetchDetailsSpy.mockResolvedValue(userDetails);
        await store.dispatch(fetchUserDetails(userid));
        expect(userFetchDetailsSpy).toHaveBeenCalledWith({ userid });
        expect(store.getState().status).toEqual("succeeded");
        expect(store.getState().byId[userid]).toEqual(userDetails);
      });
    });
    describe("when dispatched with valid params but fetch fails", () => {
      it("should update status to failed", async () => {
        const userid = "1234";
        const errorMsg = "Failed";
        userFetchDetailsSpy.mockRejectedValue(new Error(errorMsg));
        await store.dispatch(fetchUserDetails(userid));
        expect(userFetchDetailsSpy).toHaveBeenCalledWith({ userid });
        expect(store.getState().status).toEqual("failed");
        expect(store.getState().error).toEqual(errorMsg);
      });
    });
  });
});
