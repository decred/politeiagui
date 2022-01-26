import reducer, {
  fetchTicketvoteInventory,
  fetchTicketvoteNextRecordsPage,
  initialState,
} from "./inventorySlice";
import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { records } from "@politeiagui/core/records";
import policyReducer from "../policy/policySlice";

describe("Given the recordsInventorySlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchInventorySpy;
  let fetchRecordsSpy;
  const params = {
    status: 1,
    page: 1,
  };
  const unauthorized = Array(10).fill("fakeToken");
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({
      reducer: {
        ticketvoteInventory: reducer,
        ticketvotePolicy: policyReducer,
      },
      preloadedState: {
        ticketvotePolicy: {
          policy: { inventorypagesize: 20 },
        },
      },
    });
    fetchInventorySpy = jest.spyOn(api, "fetchInventory");
    fetchRecordsSpy = jest.spyOn(records, "fetch");
  });
  afterEach(() => {
    fetchInventorySpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when invalid status is passed to fetchTicketvoteInventory", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidStatusParams = {
        status: 10,
        page: 1,
      };

      const noStatusParams = {
        page: 1,
      };

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // Invalid status
      await store.dispatch(fetchTicketvoteInventory(invalidStatusParams));
      expect(fetchInventorySpy).not.toBeCalled();
      expect(consoleErrorSpy).toBeCalled();
      let state = store.getState().ticketvoteInventory;
      expect(state.unauthorized.tokens).toEqual([]);
      expect(state.unauthorized.lastPage).toEqual(0);
      expect(state.unauthorized.status).toEqual("idle");

      // No status
      await store.dispatch(fetchTicketvoteInventory(noStatusParams));
      expect(fetchInventorySpy).not.toBeCalled();
      expect(consoleErrorSpy).toBeCalledWith(Error("status is required"));
      state = store.getState().ticketvoteInventory;
      expect(state.unauthorized.tokens).toEqual([]);
      expect(state.unauthorized.lastPage).toEqual(0);
      expect(state.unauthorized.status).toEqual("idle");

      consoleErrorSpy.mockRestore();
    });
  });
  describe("when fetchTicketvoteInventory dispatches without policy", () => {
    it("should update the status to failed and log the error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      store = configureStore({ reducer: { ticketvoteInventory: reducer } });
      await store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).not.toBeCalled();
      expect(consoleErrorSpy).toBeCalled();
      const state = store.getState().ticketvoteInventory;
      expect(state.unauthorized.tokens).toEqual([]);
      expect(state.unauthorized.lastPage).toEqual(0);
      expect(state.status).toEqual("failed");

      consoleErrorSpy.mockRestore();
    });
  });
  describe("when fetchTicketvoteInventory dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState().ticketvoteInventory;
      expect(state.unauthorized.tokens).toEqual([]);
      expect(state.unauthorized.lastPage).toEqual(0);
      expect(state.unauthorized.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteInventory succeeds", () => {
    it("should update tokens, last page and status (succeeded/isDone for tokens.length < inventorypagesize)", async () => {
      const resValue = { vetted: { unauthorized: [] }, bestblock: 67 };
      fetchInventorySpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState().ticketvoteInventory;
      expect(state.unauthorized.tokens).toEqual([]);
      expect(state.unauthorized.lastPage).toEqual(1);
      expect(state.unauthorized.status).toEqual("succeeded/isDone");
    });
    it("should update tokens, last page and status (succeeded/hasMore for tokens.length == inventorypagesize)", async () => {
      const fakeToken = "fakeToken";
      const resValue = {
        vetted: { unauthorized: Array(20).fill(fakeToken) },
        bestblock: 420,
      };
      fetchInventorySpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState().ticketvoteInventory;
      expect(state.unauthorized.tokens).toEqual(Array(20).fill(fakeToken));
      expect(state.unauthorized.lastPage).toEqual(1);
      expect(state.unauthorized.status).toEqual("succeeded/hasMore");
    });
  });
  describe("when fetchTicketvoteInventory fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchInventorySpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState().ticketvoteInventory;
      expect(state.unauthorized.tokens).toEqual([]);
      expect(state.unauthorized.lastPage).toEqual(0);
      expect(state.status).toEqual("failed");
      expect(state.error).toEqual("ERROR");
    });
  });
  describe("when fetchTicketvoteNextRecordsPage is called with empty tokens", () => {
    store = configureStore({
      reducer: { ticketvoteInventory: reducer },
      preloadedState: {
        ticketvoteInventory: {
          recordsFetchQueue: { tokens: [], status: "idle" },
        },
      },
    });
    it("should not fetch records nor fire records actions", async () => {
      await store.dispatch(fetchTicketvoteNextRecordsPage());
      expect(fetchRecordsSpy).not.toBeCalled();
      const state = store.getState().ticketvoteInventory;
      expect(state.recordsFetchQueue.tokens).toEqual([]);
      expect(state.recordsFetchQueue.status).toEqual("idle");
    });
  });
  describe("when fetchTicketvoteNextRecordsPage dispatches with valid tokens", () => {
    it("should update the status to loading", async () => {
      store = configureStore({
        reducer: { ticketvoteInventory: reducer },
        preloadedState: {
          ticketvoteInventory: {
            recordsFetchQueue: { tokens: unauthorized, status: "idle" },
          },
        },
      });

      store.dispatch(fetchTicketvoteNextRecordsPage());
      const state = store.getState().ticketvoteInventory;
      expect(state.recordsFetchQueue.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteNextRecordsPage succeeds", () => {
    it("should have fetched records", async () => {
      store = configureStore({
        reducer: { ticketvoteInventory: reducer },
        preloadedState: {
          ticketvoteInventory: {
            recordsFetchQueue: { tokens: unauthorized, status: "idle" },
          },
        },
      });
      await store.dispatch(fetchTicketvoteNextRecordsPage());

      expect(fetchRecordsSpy).toBeCalled();
      const state = store.getState().ticketvoteInventory;
      expect(state.recordsFetchQueue.tokens).toEqual(unauthorized);
    });
  });
});
