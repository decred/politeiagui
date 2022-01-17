import reducer, {
  fetchRecords,
  initialState,
  setFetchQueue,
  pushFetchQueue,
  popFetchQueue,
} from "./recordsSlice";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "../../client";

describe("Given the recordsSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchRecordsSpy;
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
  });
  afterEach(() => {
    fetchRecordsSpy.mockRestore();
  });
  describe("when empty parameters", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  describe("when invalid params are passed to fetchRecords thunk", () => {
    it("should not fetch nor fire actions", async () => {
      const badArgs = ["bad", 123, {}, null, undefined];
      for (const arg of badArgs) {
        await store.dispatch(fetchRecords(arg));
        expect(fetchRecordsSpy).not.toBeCalled();
        const state = store.getState();
        expect(state.records).toEqual({});
        expect(state.recordsFetchQueue).toEqual({});
        expect(state.status).toEqual("idle");
      }
    });
  });
  describe("when fetchRecords dispatches", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchRecords(params));
      let state = store.getState();
      expect(fetchRecordsSpy).toBeCalledWith(state, params);
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
      await store.dispatch(fetchRecords(params));
      expect(fetchRecordsSpy).toBeCalledWith(
        { ...state, status: "loading" },
        params
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
      await store.dispatch(fetchRecords(["fake_token01"]));

      state = store.getState();
      expect(state.records).toEqual(fakeRecordsRes);
      expect(state.status).toBe("succeeded");
      expect(state.error).toBe(null);

      fetchRecordsSpy.mockResolvedValue(fakeRecordsRes2);
      await store.dispatch(fetchRecords(["fake_token02"]));
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
      await store.dispatch(fetchRecords(params));
      expect(fetchRecordsSpy).toBeCalledWith(
        { ...state, status: "loading" },
        params
      );
      state = store.getState();
      expect(state.records).toEqual({});
      expect(state.status).toEqual("failed");
      expect(state.error).toEqual("FAIL!");
    });
  });
  describe("when dispatching actions", () => {
    const goodParams = {
      recordsState: "vetted",
      status: "public",
      records: ["fake_token"],
    };
    const goodParams2 = {
      recordsState: "vetted",
      status: "public",
      records: ["fake_token2"],
    };
    const badParams = [
      {
        recordsState: "vetted",
        status: "public",
        records: "fake_token",
      },
      {
        recordsState: "vetted",
        status: "public",
        records: 123,
      },
      {
        recordsState: "vetted",
        status: "public",
        records: {},
      },
      {
        recordsState: "vtted",
        status: "public",
        records: ["fake_token"],
      },
      {
        recordsState: "vetted",
        status: "publ",
        records: ["fake_token"],
      },
    ];
    describe("when dispatching setFetchQueue", () => {
      it("should update the fetch queue when passing valid params", () => {
        store.dispatch(setFetchQueue(goodParams));
        const state = store.getState();
        const { recordsState, status, records } = goodParams;
        expect(state.recordsFetchQueue[recordsState][status]).toEqual(records);
      });

      it("should throw when passing invalid params", () => {
        for (const arg of badParams) {
          // eslint-disable-next-line no-loop-func
          expect(() => store.dispatch(setFetchQueue(arg))).toThrow();
          const state = store.getState();
          expect(state.records).toEqual({});
          expect(state.status).toEqual("idle");
          expect(state.error).toEqual(null);
        }
      });
    });
    describe("when dispatching pushFetchQueue", () => {
      it("should push to the empty queue when passing valid params", () => {
        store.dispatch(pushFetchQueue(goodParams));
        const state = store.getState();
        const { recordsState, status, records } = goodParams;
        expect(state.recordsFetchQueue[recordsState][status]).toEqual(records);
      });
      it("should push to the populated queue when passing valid params", () => {
        store.dispatch(pushFetchQueue(goodParams));
        let state = store.getState();
        const { recordsState, status, records } = goodParams;
        expect(state.recordsFetchQueue[recordsState][status]).toEqual(records);
        // now try to push to the non-empty queue
        store.dispatch(pushFetchQueue(goodParams2));
        const {
          records: records2,
          recordsState: recordsState2,
          status: status2,
        } = goodParams2;
        state = store.getState();
        expect(state.recordsFetchQueue[recordsState2][status2]).toEqual([
          ...records,
          ...records2,
        ]);
      });
      it("should throw when passing invalid params", () => {
        for (const arg of badParams) {
          // eslint-disable-next-line no-loop-func
          expect(() => store.dispatch(pushFetchQueue(arg))).toThrow();
          const state = store.getState();
          expect(state.records).toEqual({});
          expect(state.recordsFetchQueue).toEqual({});
          expect(state.status).toEqual("idle");
          expect(state.error).toEqual(null);
        }
      });
    });
    describe("when dispatching popFetchQueue", () => {
      it("should do nothing when trying to pop from an empty queue", () => {
        const { recordsState, status } = goodParams;
        store.dispatch(popFetchQueue({ recordsState, status }));
        const state = store.getState();
        expect(state.records).toEqual({});
        expect(state.recordsFetchQueue).toEqual({});
        expect(state.status).toEqual("idle");
        expect(state.error).toEqual(null);
      });
      it("should pop from the populated queue when passing valid params", () => {
        store.dispatch(pushFetchQueue(goodParams));
        let state = store.getState();
        const { recordsState, status, records } = goodParams;
        expect(state.recordsFetchQueue[recordsState][status]).toEqual(records);
        store.dispatch(pushFetchQueue(goodParams2));
        const {
          records: records2,
          recordsState: recordsState2,
          status: status2,
        } = goodParams2;
        state = store.getState();
        expect(state.recordsFetchQueue[recordsState2][status2]).toEqual([
          ...records,
          ...records2,
        ]);
        store.dispatch(popFetchQueue({ recordsState, status }));
        state = store.getState();
        expect(state.recordsFetchQueue[recordsState2][status2]).toEqual([
          "fake_token2",
        ]);
      });
      it("should throw when passing invalid params", () => {
        const popBadParams = [
          {
            recordsState: "vtted",
            status: "public",
          },
          {
            recordsState: "vetted",
            status: "publ",
          },
        ];
        for (const arg of popBadParams) {
          // eslint-disable-next-line no-loop-func
          expect(() => store.dispatch(popFetchQueue(arg))).toThrow();
          const state = store.getState();
          expect(state.records).toEqual({});
          expect(state.status).toEqual("idle");
          expect(state.error).toEqual(null);
        }
      });
    });
  });
});