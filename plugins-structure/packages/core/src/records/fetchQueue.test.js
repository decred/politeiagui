/**
 * This is the integration test between recordsInventory and records slices.
 * The goal is to test the recordsFetchQueue.
 */
import recordsInventoryReducer, {
  fetchRecordsInventory,
} from "./inventory/recordsInventorySlice";
import apiReducer, { fetchApi } from "../api/apiSlice";
import recordsReducer, {
  fetchRecordsNextPage,
  pushFetchQueue,
} from "./records/recordsSlice";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "../client";

const mockRecord = {
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

const mockApiReturn = {
  version: 1,
  route: "/v1",
  pubkey: "fake_pubkey",
  testnet: true,
  mode: "piwww",
  activeusersession: true,
};

const mockCsrfToken = "fake_csrf";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve("success"),
  })
);

describe("Given the recordsInventory slice and the records slice", () => {
  let store;
  const params = {
    recordsState: 2,
    status: 2,
    page: 1,
  };
  let fetchApiSpy;
  // spy on the fetchRecords client function
  let fetchRecordsSpy;
  // spy on the fetchRecordsInventory client function
  let fetchRecordsInventorySpy;
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    fetch.mockClear();
    const staticReducers = {
      api: apiReducer,
      recordsInventory: recordsInventoryReducer,
      records: recordsReducer,
    };
    store = configureStore({
      reducer: staticReducers,
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
    fetchApiSpy = jest.spyOn(client, "fetchApi");
    fetchRecordsInventorySpy = jest.spyOn(client, "fetchRecordsInventory");
  });
  afterEach(() => {
    fetchApiSpy.mockRestore();
    fetchRecordsSpy.mockRestore();
    fetchRecordsInventorySpy.mockRestore();
  });
  describe("when fetchRecordsInventory is fired", () => {
    it("should populate the fetchQueue when the fetchRecordsInventory is dispatched", async () => {
      const resValue = {
        vetted: { public: ["fake_token", "fake_token2", "fake_token3"] },
        unvetted: {},
      };
      fetchRecordsInventorySpy.mockResolvedValueOnce(resValue);
      fetchRecordsSpy.mockResolvedValueOnce({
        fake_token: mockRecord,
        fake_token2: mockRecord,
        fake_token3: mockRecord,
      });

      await store.dispatch(fetchRecordsInventory(params));

      const { recordsInventory, records } = store.getState();
      expect(recordsInventory.vetted.public.tokens).toEqual([
        "fake_token",
        "fake_token2",
        "fake_token3",
      ]);
      expect(recordsInventory.vetted.public.status).toEqual("succeeded/isDone");
      expect(recordsInventory.vetted.public.lastPage).toEqual(1);
      expect(records.recordsFetchQueue.vetted.public).toEqual([
        "fake_token",
        "fake_token2",
        "fake_token3",
      ]);
      expect(records.status).toEqual("loading");
    });
  });
  describe("when dispatching fetchRecordsNextPage", () => {
    it("should remove RECORDS_PAGE_SIZE tokens from the fetchQueue, populate records and status should be succeeded", async () => {
      fetch.mockImplementation(() =>
        Promise.resolve({
          status: 200,
          json: () =>
            Promise.resolve({
              records: {
                fake_token: mockRecord,
                fake_token2: mockRecord,
                fake_token3: mockRecord,
              },
            }),
        })
      );
      fetchApiSpy.mockResolvedValueOnce({
        api: mockApiReturn,
        csrf: mockCsrfToken,
      });
      await store.dispatch(fetchApi());
      await store.dispatch(
        pushFetchQueue({
          recordsState: 2,
          status: 2,
          records: ["fake_token", "fake_token2", "fake_token3"],
        })
      );
      let state = store.getState();
      expect(state.records.recordsFetchQueue.vetted.public).toEqual([
        "fake_token",
        "fake_token2",
        "fake_token3",
      ]);
      await store.dispatch(
        fetchRecordsNextPage({
          recordsState: 2,
          status: 2,
        })
      );
      state = store.getState();
      expect(state.records.recordsFetchQueue.vetted.public).toEqual([]);
      expect(state.records.records).toEqual({
        fake_token: mockRecord,
        fake_token2: mockRecord,
        fake_token3: mockRecord,
      });
      expect(state.records.status).toEqual("succeeded");
      expect(state.records.error).toEqual(null);
    });
  });
});
