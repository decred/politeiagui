import reducer, {
  fetchRecordTimestamps,
  initialState,
} from "./timestampsSlice";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "../../client";

describe("Given the recordsSlice", () => {
  let store;
  let fetchRecordTimestampsSpy;
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
    fetchRecordTimestampsSpy = jest.spyOn(client, "fetchRecordTimestamps");
  });
  afterEach(() => {
    fetchRecordTimestampsSpy.mockRestore();
  });
  describe("when empty parameters", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  // timestamps
  describe("when invalid params are passed to fetchRecordTimestamps thunk", () => {
    it("should not fetch nor fire actions", async () => {
      const badArgs = [{}, 123, null, undefined];
      for (const arg of badArgs) {
        await store.dispatch(fetchRecordTimestamps({ token: arg }));
        expect(fetchRecordTimestampsSpy).not.toBeCalled();
        expect(store.getState()).toEqual(initialState);
      }
    });
  });
  describe("when fetchRecordTimestamps dispatches", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchRecordTimestamps({ token: "fake-token" }));
      const state = store.getState();
      expect(fetchRecordTimestampsSpy).toBeCalledWith(state, {
        token: "fake-token",
      });
      expect(state.status).toEqual("loading");
    });
  });
  describe("when fetchRecordTimestamps succeeds", () => {
    it("should update timestamps by token and status to succeeded", async () => {
      let state = store.getState();
      const fakeTimestampsRes = {
        files: { file1: {}, file2: {} },
        metadata: { usermd: {} },
        recordmetadata: { data: "fakedata" },
      };
      fetchRecordTimestampsSpy.mockResolvedValueOnce(fakeTimestampsRes);
      await store.dispatch(fetchRecordTimestamps({ token: "fake-token" }));
      expect(fetchRecordTimestampsSpy).toBeCalledWith(
        { ...state, status: "loading" },
        { token: "fake-token" }
      );
      state = store.getState();
      expect(state.byToken).toEqual({ "fake-token": { 1: fakeTimestampsRes } });
    });
    it("should update timestamps by token with the correct version", async () => {
      let state = store.getState();
      const fakeTimestampsRes = {
        files: { file1: {}, file2: {} },
        metadata: { usermd: {} },
        recordmetadata: { data: "fakedata" },
      };
      fetchRecordTimestampsSpy.mockResolvedValueOnce(fakeTimestampsRes);
      await store.dispatch(
        fetchRecordTimestamps({ token: "fake-token", version: 4 })
      );
      expect(fetchRecordTimestampsSpy).toBeCalledWith(
        { ...state, status: "loading" },
        { token: "fake-token", version: 4 }
      );
      state = store.getState();
      expect(state.byToken).toEqual({ "fake-token": { 4: fakeTimestampsRes } });
    });
  });
  describe("when fetchRecordTimestamps fails", () => {
    it("should dispatch failure and update the error", async () => {
      let state = store.getState();
      const error = new Error("FAIL!");
      fetchRecordTimestampsSpy.mockRejectedValue(error);
      await store.dispatch(fetchRecordTimestamps({ token: "fake-token" }));
      expect(fetchRecordTimestampsSpy).toBeCalledWith(
        { ...state, status: "loading" },
        { token: "fake-token" }
      );
      state = store.getState();
      expect(state.byToken).toEqual({});
      expect(state.status).toEqual("failed");
      expect(state.error).toEqual("FAIL!");
    });
  });
});
