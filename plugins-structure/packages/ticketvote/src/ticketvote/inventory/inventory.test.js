import reducer, {
  fetchTicketvoteInventory,
  initialState,
} from "./inventorySlice";
import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import {
  getTicketvotePluginErrorMessage,
  getTicketvoteUserErrorMessage,
} from "../../lib/errors";
import policyReducer from "../policy/policySlice";

// Test Mocks
jest.mock(
  "@politeiagui/core/records",
  () => ({
    records: {
      fetch: () => jest.fn(),
    },
  }),
  { virtual: true }
);
jest.mock(
  "@politeiagui/core/records/validation",
  () => ({
    validateRecordsPageSize: () => true,
  }),
  { virtual: true }
);

describe("Given the recordsInventorySlice", () => {
  let store;
  // spy on the method used to fetch

  let fetchInventorySpy;
  const params = {
    status: 1,
    page: 1,
  };
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
      const unauthorized = Array(20)
        .fill("")
        .map((_, i) => `fakeToken-${i}`);
      const resValue = {
        vetted: { unauthorized },
        bestblock: 420,
      };
      fetchInventorySpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState().ticketvoteInventory;
      expect(state.unauthorized.tokens).toEqual(unauthorized);
      expect(state.unauthorized.lastPage).toEqual(1);
      expect(state.unauthorized.status).toEqual("succeeded/hasMore");
    });
    it("should avoid duplicate tokens", async () => {
      const fakeToken = "fakeToken";
      const resValue = {
        vetted: { unauthorized: Array(20).fill(fakeToken) },
        bestBlock: 420,
      };
      fetchInventorySpy.mockResolvedValueOnce(resValue);
      await store.dispatch(fetchTicketvoteInventory(params));
      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState().ticketvoteInventory;
      expect(state.unauthorized.tokens).toEqual([fakeToken]);
      expect(state.unauthorized.lastPage).toEqual(1);
      expect(state.unauthorized.status).toEqual("succeeded/hasMore");
    });
  });
  describe("when fetchTicketvoteInventory fails", () => {
    it("should dispatch failure", async () => {
      const error = new Error("Error!");
      fetchInventorySpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchTicketvoteInventory(params));

      expect(fetchInventorySpy).toBeCalled();
      const state = store.getState().ticketvoteInventory;
      expect(state.unauthorized.tokens).toEqual([]);
      expect(state.unauthorized.lastPage).toEqual(0);
      expect(state.status).toEqual("failed");
      expect(state.error).toEqual("Error!");
    });
    it("should return correct plugin error messages", async () => {
      const errorcodes = Array(20)
        .fill()
        .map((_, i) => i + 1);
      for (const errorcode of errorcodes) {
        const error = { body: { errorcode, pluginid: "ticketvote" } };
        const message = getTicketvotePluginErrorMessage(errorcode);
        fetchInventorySpy.mockRejectedValueOnce(error);
        await store.dispatch(fetchTicketvoteInventory(params));
        expect(fetchInventorySpy).toBeCalled();
        const state = store.getState().ticketvoteInventory;
        expect(state.unauthorized.tokens).toEqual([]);
        expect(state.unauthorized.lastPage).toEqual(0);
        expect(state.status).toEqual("failed");
        expect(state.error).toEqual(message);
      }
    });
    it("should return correct user error messages", async () => {
      const errorcodes = Array(9)
        .fill()
        .map((_, i) => i);
      for (const errorcode of errorcodes) {
        const error = { body: { errorcode } };
        const message = getTicketvoteUserErrorMessage(errorcode);
        fetchInventorySpy.mockRejectedValueOnce(error);
        await store.dispatch(fetchTicketvoteInventory(params));
        expect(fetchInventorySpy).toBeCalled();
        const state = store.getState().ticketvoteInventory;
        expect(state.unauthorized.tokens).toEqual([]);
        expect(state.unauthorized.lastPage).toEqual(0);
        expect(state.status).toEqual("failed");
        expect(state.error).toEqual(message);
      }
    });
  });
});
