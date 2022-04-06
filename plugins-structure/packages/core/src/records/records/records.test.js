import reducer, {
  fetchRecordDetails,
  fetchRecords,
  initialState,
  selectRecordsByStateAndStatus,
} from "./recordsSlice";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "../../client";
import { getRecordsUserError } from "../errors";

describe("Given the recordsSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchRecordsSpy, fetchRecordDetailsSpy;
  const params = ["fake_token"];
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
    fetchRecordsSpy = jest.spyOn(client, "fetchRecords");
    fetchRecordDetailsSpy = jest.spyOn(client, "fetchRecordDetails");
  });
  afterEach(() => {
    fetchRecordsSpy.mockRestore();
    fetchRecordDetailsSpy.mockRestore();
  });
  describe("when empty parameters", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  // Records
  describe("when invalid params are passed to fetchRecords thunk", () => {
    it("should not fetch nor fire actions", async () => {
      const badArgs = ["bad", 123, {}, null, undefined];
      for (const arg of badArgs) {
        await store.dispatch(fetchRecords({ tokens: arg }));
        expect(fetchRecordsSpy).not.toBeCalled();
        const state = store.getState();
        expect(state.records).toEqual({});
        expect(state.status).toEqual("idle");
      }
    });
  });
  describe("when fetchRecords dispatches", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchRecords({ tokens: params }));
      let state = store.getState();
      expect(fetchRecordsSpy).toBeCalledWith(state, params, []);
      state = store.getState();
      expect(state.status).toEqual("loading");
    });
  });
  describe("when fetchRecords succeeds", () => {
    it("should update records and status should be succeeded", async () => {
      let state = store.getState();
      const fakeRecordsRes = {
        fake_token: {
          state: 2,
          status: 2,
          version: 1,
          timestamp: 1500000000,
          username: "user1",
          metadata: [],
          files: [],
          censorshiprecord: {
            token: "fake_token",
            merkle: "fake_merkle",
            signature: "fake_signature",
          },
        },
      };
      fetchRecordsSpy.mockResolvedValueOnce(fakeRecordsRes);
      await store.dispatch(fetchRecords({ tokens: params }));
      expect(fetchRecordsSpy).toBeCalledWith(
        { ...state, status: "loading" },
        params,
        []
      );
      state = store.getState();
      expect(state.records).toEqual(fakeRecordsRes);
      expect(state.status).toBe("succeeded");
      expect(state.error).toBe(null);
    });
    it("should add a new key to 'records' if it's not empty", async () => {
      let state = store.getState();
      const fakeRecordsRes = {
        fake_token01: {
          state: 2,
          status: 2,
          version: 1,
          timestamp: 1500000000,
          username: "user1",
          metadata: [],
          files: [],
          censorshiprecord: {
            token: "fake_token01",
            merkle: "fake_merkle",
            signature: "fake_signature",
          },
        },
      };
      const fakeRecordsRes2 = {
        fake_token02: {
          state: 2,
          status: 2,
          version: 1,
          timestamp: 1500000000,
          username: "user1",
          metadata: [],
          files: [],
          censorshiprecord: {
            token: "fake_token02",
            merkle: "fake_merkle",
            signature: "fake_signature",
          },
        },
      };
      fetchRecordsSpy.mockResolvedValue(fakeRecordsRes);
      await store.dispatch(fetchRecords({ tokens: ["fake_token01"] }));

      state = store.getState();
      expect(state.records).toEqual(fakeRecordsRes);
      expect(state.status).toBe("succeeded");
      expect(state.error).toBe(null);

      fetchRecordsSpy.mockResolvedValue(fakeRecordsRes2);
      await store.dispatch(fetchRecords({ tokens: ["fake_token02"] }));
      state = store.getState();
      expect(state.records).toEqual({ ...fakeRecordsRes, ...fakeRecordsRes2 });
      expect(state.status).toBe("succeeded");
      expect(state.error).toBe(null);
    });
  });
  describe("when fetchRecords fails", () => {
    it("should dispatch failure and update the error", async () => {
      let state = store.getState();
      const error = new Error("FAIL!");
      fetchRecordsSpy.mockRejectedValue(error);
      await store.dispatch(fetchRecords({ tokens: params }));
      expect(fetchRecordsSpy).toBeCalledWith(
        { ...state, status: "loading" },
        params,
        []
      );
      state = store.getState();
      expect(state.records).toEqual({});
      expect(state.status).toEqual("failed");
      expect(state.error).toEqual("FAIL!");
    });
    it("should return correct user error messages", async () => {
      const errorcodes = Array(20)
        .fill()
        .map((_, i) => i + 1);
      for (const errorcode of errorcodes) {
        const error = { body: { errorcode } };
        const message = getRecordsUserError(errorcode);
        fetchRecordsSpy.mockRejectedValueOnce(error);
        await store.dispatch(fetchRecords({ tokens: params }));
        expect(fetchRecordsSpy).toBeCalled();
        const state = store.getState();
        expect(state.status).toEqual("failed");
        expect(state.error).toEqual(message);
      }
    });
  });

  // Details
  describe("when invalid params are passed to fetchRecordDetails thunk", () => {
    it("should not fetch nor fire actions", async () => {
      const badArgs = [undefined, null, {}, [], 123];
      for (const arg of badArgs) {
        await store.dispatch(fetchRecordDetails({ token: arg }));
        expect(fetchRecordDetailsSpy).not.toBeCalled();
        const state = store.getState();
        expect(state.records).toEqual({});
        expect(state.status).toEqual("idle");
      }
    });
  });
  describe("when fetchRecordDetails dispatches", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchRecordDetails({ token: "abcdefg" }));
      let state = store.getState();
      expect(fetchRecordDetailsSpy).toBeCalledWith(state, {
        token: "abcdefg",
        version: undefined,
      });
      state = store.getState();
      expect(state.status).toEqual("loading");
    });
  });
  describe("when fetchRecordDetails succeeds", () => {
    it("should update records and status should be succeeded", async () => {
      let state = store.getState();
      const fakeRecordRes = {
        state: 2,
        status: 2,
        version: 1,
        timestamp: 1500000000,
        username: "user1",
        metadata: [],
        files: [],
        censorshiprecord: {
          token: "fake_token",
          merkle: "fake_merkle",
          signature: "fake_signature",
        },
      };
      fetchRecordDetailsSpy.mockResolvedValueOnce(fakeRecordRes);
      await store.dispatch(fetchRecordDetails({ token: "fake_token" }));
      expect(fetchRecordDetailsSpy).toBeCalledWith(
        { ...state, status: "loading" },
        { token: "fake_token", version: undefined }
      );
      state = store.getState();
      expect(state.records).toEqual({ fake_token: fakeRecordRes });
      expect(state.status).toBe("succeeded");
      expect(state.error).toBe(null);
    });
  });
  describe("when fetchRecordDetails fails", () => {
    it("should dispatch failure and update the error", async () => {
      let state = store.getState();
      const error = new Error("FAIL!");
      fetchRecordDetailsSpy.mockRejectedValue(error);
      await store.dispatch(
        fetchRecordDetails({ token: "abcdefg", version: 3 })
      );
      expect(fetchRecordDetailsSpy).toBeCalledWith(
        { ...state, status: "loading" },
        { token: "abcdefg", version: 3 }
      );
      state = store.getState();
      expect(state.records).toEqual({});
      expect(state.status).toEqual("failed");
      expect(state.error).toEqual("FAIL!");
    });
  });

  // Selectors
  describe("Given the selectRecordsByStateAndStatus selector", () => {
    // ignoring censorshiprecord for simplicity. Added a token key instead.
    const mockState = {
      recordsInventory: {
        vetted: {
          archived: {
            tokens: ["48cf35d5898be431"],
            lastPage: 1,
            status: "succeeded/isDone",
          },
          public: {
            tokens: [
              "ec75681c4481e72a",
              "15b380b22dc1b072",
              "7a3b96e8f439b17a",
              "99bd3e32a4902045",
              "cae588e536163306",
              "cb94db618c2f3653",
              "7ab8d6e031c82505",
              "193a26ee838e2715",
              "635f1e3e41518358",
              "fb9f0e611a684a6a",
              "c0a2c487952dd414",
              "2dc6f6f77565f256",
              "329087ab6e50dc49",
              "33f81b057eabdf1f",
              "cb413f57bfd3c569",
            ],
            lastPage: 1,
            status: "succeeded/isDone",
          },
        },
        error: "records must be an array",
        status: "failed",
      },
      records: {
        records: {
          "48cf35d5898be431": {
            state: 2,
            status: 4,
            version: 1,
            timestamp: 1643054597,
            username: "adminuser",
            token: "48cf35d5898be431",
          },
          "15b380b22dc1b072": {
            state: 2,
            status: 2,
            version: 1,
            timestamp: 1643054779,
            username: "adminuser",
            token: "15b380b22dc1b072",
          },
          "7a3b96e8f439b17a": {
            state: 2,
            status: 2,
            version: 1,
            timestamp: 1643054771,
            username: "adminuser",
            token: "7a3b96e8f439b17a",
          },
          "99bd3e32a4902045": {
            state: 2,
            status: 2,
            version: 1,
            timestamp: 1643054758,
            username: "adminuser",
            token: "99bd3e32a4902045",
          },
          cae588e536163306: {
            state: 2,
            status: 2,
            version: 1,
            timestamp: 1643054752,
            username: "adminuser",
            token: "cae588e536163306",
          },
          ec75681c4481e72a: {
            state: 2,
            status: 2,
            version: 1,
            timestamp: 1643054788,
            username: "adminuser",
            token: "ec75681c4481e72a",
          },
        },
        recordsFetchQueue: {
          vetted: {
            public: [
              "cb94db618c2f3653",
              "7ab8d6e031c82505",
              "193a26ee838e2715",
              "635f1e3e41518358",
              "fb9f0e611a684a6a",
              "c0a2c487952dd414",
              "2dc6f6f77565f256",
              "329087ab6e50dc49",
              "33f81b057eabdf1f",
              "cb413f57bfd3c569",
            ],
            archived: [],
          },
        },
        status: "succeeded",
        error: null,
      },
      recordsPolicy: {
        policy: {
          recordspagesize: 5,
          inventorypagesize: 20,
        },
        status: "succeeded",
        error: null,
      },
    };
    it("should return correct records batch", () => {
      const res = selectRecordsByStateAndStatus(mockState, {
        recordsState: "vetted",
        status: "public",
      });
      expect(res).toMatchObject({
        "15b380b22dc1b072": {
          state: 2,
          status: 2,
          version: 1,
          timestamp: 1643054779,
          username: "adminuser",
          token: "15b380b22dc1b072",
        },
        "7a3b96e8f439b17a": {
          state: 2,
          status: 2,
          version: 1,
          timestamp: 1643054771,
          username: "adminuser",
          token: "7a3b96e8f439b17a",
        },
        "99bd3e32a4902045": {
          state: 2,
          status: 2,
          version: 1,
          timestamp: 1643054758,
          username: "adminuser",
          token: "99bd3e32a4902045",
        },
        cae588e536163306: {
          state: 2,
          status: 2,
          version: 1,
          timestamp: 1643054752,
          username: "adminuser",
          token: "cae588e536163306",
        },
        ec75681c4481e72a: {
          state: 2,
          status: 2,
          version: 1,
          timestamp: 1643054788,
          username: "adminuser",
          token: "ec75681c4481e72a",
        },
      });
    });
  });
});
