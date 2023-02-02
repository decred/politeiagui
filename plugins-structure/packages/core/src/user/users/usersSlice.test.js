import reducer, {
  fetchUserDetails,
  initialState,
  userManage,
} from "./usersSlice";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "../../client/client";

describe("Given the usersSlice", () => {
  let store;
  // Methods used to fetch
  let userFetchDetailsSpy, userManageSpy;
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
    userManageSpy = jest.spyOn(client, "userManage");
  });
  afterEach(() => {
    userFetchDetailsSpy.mockRestore();
    userManageSpy.mockRestore();
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
        const userDetails = { user: { userid, name: "John Doe" } };
        userFetchDetailsSpy.mockResolvedValue(userDetails);
        await store.dispatch(fetchUserDetails(userid));
        expect(userFetchDetailsSpy).toHaveBeenCalledWith({ userid });
        expect(store.getState().status).toEqual("succeeded");
        expect(store.getState().byId[userid]).toEqual(userDetails.user);
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

  describe("userManage", () => {
    describe("when dispatched with invalid params", () => {
      it("should not fetch nor fire actions", async () => {
        const badArgs = [
          null,
          undefined,
          {},
          { userid: null },
          { userid: undefined },
          { userid: "valid", action: "invalid" },
          { userid: null, action: "expirenewuser" },
        ];
        await Promise.all(
          badArgs.map(async (args) => {
            await store.dispatch(userManage(args));
            expect(userManageSpy).not.toHaveBeenCalled();
            expect(store.getState().status).toEqual("idle");
          })
        );
      });
    });
    describe("when dispatched with valid params", () => {
      const validParams = { userid: "1234", action: "expirenewuser" };
      it("should update status to loading", () => {
        store.dispatch(userManage(validParams));
        expect(store.getState().status).toEqual("loading");
      });
      it("should update status to succeeded when resolved", async () => {
        userManageSpy.mockResolvedValue();
        await store.dispatch(userManage(validParams));
        expect(userManageSpy).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining(validParams)
        );
        expect(store.getState().status).toEqual("succeeded");
      });
      it("should update status to failed when rejected", async () => {
        const errorMsg = "Failed";
        userManageSpy.mockRejectedValue(new Error(errorMsg));
        await store.dispatch(userManage(validParams));
        expect(userManageSpy).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining(validParams)
        );
        expect(store.getState().status).toEqual("failed");
        expect(store.getState().error).toEqual(errorMsg);
      });
    });
  });
});
