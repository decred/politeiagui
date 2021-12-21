import reducer, {
  fetchTicketvoteInventory,
  fetchTicketvoteNextRecordsPage,
  initialState,
} from "./inventorySlice";
import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { records } from "@politeiagui/core/records";

describe("Given the recordsInventorySlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchInventorySpy;
  let fetchRecordsSpy;
  const params = {
    status: 1,
    page: 1,
  };
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { ticketvoteInventory: reducer } });
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

      const consoleErrorMock = jest
        .spyOn(console, "error")
        .mockImplementation();

      // Invalid status
      await store.dispatch(fetchTicketvoteInventory(invalidStatusParams));
      expect(fetchInventorySpy).not.toBeCalled();
      expect(consoleErrorMock).toBeCalled();
      let state = store.getState();
      expect(state.ticketvoteInventory.unauthorized.tokens).toEqual([]);
      expect(state.ticketvoteInventory.unauthorized.lastPage).toEqual(0);
      expect(state.ticketvoteInventory.unauthorized.status).toEqual("idle");

      // No status
      await store.dispatch(fetchTicketvoteInventory(noStatusParams));
      expect(fetchInventorySpy).not.toBeCalled();
      expect(consoleErrorMock).toBeCalledWith(Error("status is required"));
      state = store.getState();
      expect(state.ticketvoteInventory.unauthorized.tokens).toEqual([]);
      expect(state.ticketvoteInventory.unauthorized.lastPage).toEqual(0);
      expect(state.ticketvoteInventory.unauthorized.status).toEqual("idle");

      consoleErrorMock.mockRestore();
    });
  });
  describe("when fetchTicketvoteInventory dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteInventory.unauthorized.tokens).toEqual([]);
      expect(state.ticketvoteInventory.unauthorized.lastPage).toEqual(0);
      expect(state.ticketvoteInventory.unauthorized.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteInventory succeeds", () => {
    it("should update tokens, last page and status (succeeded/isDone for tokens.length < 20)", async () => {
      const resValue = { vetted: { unauthorized: [] }, bestblock: 67 };
      fetchInventorySpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteInventory.unauthorized.tokens).toEqual([]);
      expect(state.ticketvoteInventory.unauthorized.lastPage).toEqual(1);
      expect(state.ticketvoteInventory.unauthorized.status).toEqual(
        "succeeded/isDone"
      );
    });
    it("should update tokens, last page and status (succeeded/hasMore for tokens.length == 20)", async () => {
      const fakeToken = "fakeToken";
      const resValue = {
        vetted: { unauthorized: Array(20).fill(fakeToken) },
        bestblock: 420,
      };
      fetchInventorySpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteInventory.unauthorized.tokens).toEqual(
        Array(20).fill(fakeToken)
      );
      expect(state.ticketvoteInventory.unauthorized.lastPage).toEqual(1);
      expect(state.ticketvoteInventory.unauthorized.status).toEqual(
        "succeeded/hasMore"
      );
    });
  });
  describe("when fetchTicketvoteInventory fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchInventorySpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteInventory.unauthorized.tokens).toEqual([]);
      expect(state.ticketvoteInventory.unauthorized.lastPage).toEqual(0);
      expect(state.ticketvoteInventory.status).toEqual("failed");
      expect(state.ticketvoteInventory.error).toEqual("ERROR");
    });
  });
  describe("when fetchTicketvoteNextRecordsPage is called with empty tokens", () => {
    it("should not fetch records nor fire records actions", async () => {
      const resValue = {
        vetted: { unauthorized: [] },
        bestblock: 420,
      };
      fetchInventorySpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteInventory(params));
      await store.dispatch(fetchTicketvoteNextRecordsPage());

      expect(fetchRecordsSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteInventory.recordsFetchQueue.tokens).toEqual([]);
      expect(state.ticketvoteInventory.recordsFetchQueue.status).toEqual(
        "idle"
      );
    });
  });
  describe("when fetchTicketvoteNextRecordsPage dispatches with valid tokens", () => {
    it("should update the status to loading", async () => {
      const unauthorized = Array(10).fill("fakeToken");
      const resValue = {
        vetted: { unauthorized },
        bestblock: 420,
      };
      fetchInventorySpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteInventory(params));
      store.dispatch(fetchTicketvoteNextRecordsPage());

      const state = store.getState();
      expect(state.ticketvoteInventory.recordsFetchQueue.tokens).toEqual(
        unauthorized
      );
      expect(state.ticketvoteInventory.recordsFetchQueue.status).toEqual(
        "loading"
      );
    });
  });
  describe("when fetchTicketvoteNextRecordsPage succeeds", () => {
    it("should have fetched records", async () => {
      const unauthorized = Array(10).fill("fakeToken");
      const resValue = {
        vetted: { unauthorized },
        bestblock: 420,
      };
      fetchInventorySpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteInventory(params));
      await store.dispatch(fetchTicketvoteNextRecordsPage());

      expect(fetchInventorySpy).toBeCalled();
      expect(fetchRecordsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteInventory.recordsFetchQueue.tokens).toEqual(
        unauthorized
      );
    });
  });
});
