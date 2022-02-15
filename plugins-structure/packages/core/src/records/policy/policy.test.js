import { configureStore } from "@reduxjs/toolkit";
import reducer, { fetchRecordsPolicy, initialState } from "./policySlice";
import { client } from "../../client";

const mockPolicy = {
  recordspagesize: 5,
  inventorypagesize: 20,
};

describe("Given the policySlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchRecordsPolicySpy;
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
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
    fetchRecordsPolicySpy = jest.spyOn(client, "fetchRecordsPolicy");
  });
  afterEach(() => {
    fetchRecordsPolicySpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when fetchRecordsPolicy dispatches", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchRecordsPolicy());

      expect(fetchRecordsPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.policy).toEqual({});
      expect(state.status).toEqual("loading");
    });
  });
  describe("when fetchRecordsPolicy succeeds", () => {
    it("should update policy and status", async () => {
      fetchRecordsPolicySpy.mockResolvedValueOnce(mockPolicy);

      await store.dispatch(fetchRecordsPolicy());

      expect(fetchRecordsPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.policy).toEqual(mockPolicy);
      expect(state.status).toEqual("succeeded");
    });
  });
  describe("when fetchRecordsPolicy fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchRecordsPolicySpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchRecordsPolicy());

      expect(fetchRecordsPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.status).toEqual("failed");
      expect(state.error).toEqual("ERROR");
    });
  });
});
