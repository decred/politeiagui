import reducer, {
  fetchRecordsInventory,
  initialState,
} from "./recordsInventorySlice";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "../../client";

describe("Given the recordsInventorySlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchRecordsInventorySpy;
  const params = {
    recordsState: 2,
    status: 2,
    page: 1,
  };
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
    fetchRecordsInventorySpy = jest.spyOn(client, "fetchRecordsInventory");
  });
  afterEach(() => {
    fetchRecordsInventorySpy.mockRestore();
  });
  describe("when empty parameters", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when invalid params are passed to fetchRecordsInventory", () => {
    it("does not fetch nor fire actions", async () => {
      // define default parameters
      const badParams = {
        status: 2,
        page: 1,
      };

      // spy on console error
      const consoleErrorMock = jest
        .spyOn(console, "error")
        .mockImplementation();
      // spy on the method used to fetch

      await store.dispatch(fetchRecordsInventory(badParams));
      expect(consoleErrorMock).toBeCalledWith(
        Error("recordsState is required")
      );
      expect(fetchRecordsInventorySpy).not.toBeCalled();
      const state = store.getState();
      expect(state.vetted.public.tokens).toEqual([]);
      expect(state.vetted.public.lastPage).toEqual(0);
      expect(state.vetted.public.status).toEqual("idle");
      consoleErrorMock.mockRestore();
    });
  });
  describe("when fetchRecordsInventory dispatches", () => {
    it("updates the status to loading", () => {
      // do now await for store.dispatch since we want to test
      // loading
      store.dispatch(fetchRecordsInventory(params));

      const objAfterTransformation = {
        state: params.recordsState,
        status: params.status,
        page: params.page,
      };

      expect(fetchRecordsInventorySpy).toBeCalledWith(objAfterTransformation);
      const state = store.getState();
      expect(state.vetted.public.tokens).toEqual([]);
      expect(state.vetted.public.lastPage).toEqual(0);
      expect(state.vetted.public.status).toEqual("loading");
    });
  });
  describe("when fetchRecordsInventory succeeds", () => {
    it("updates tokens, last page and status (succeeded/isDone for tokens.length < 20)", async () => {
      // spy on the method used to fetch
      // mock resolved value
      const resValue = { vetted: { public: [] }, unvetted: {} };
      fetchRecordsInventorySpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchRecordsInventory(params));

      const objAfterTransformation = {
        state: params.recordsState,
        status: params.status,
        page: params.page,
      };

      expect(fetchRecordsInventorySpy).toBeCalledWith(objAfterTransformation);
      const state = store.getState();
      expect(state.vetted.public.tokens).toEqual([]);
      expect(state.vetted.public.lastPage).toEqual(1);
      expect(state.vetted.public.status).toEqual("succeeded/isDone");
    });

    it("updates tokens, last page and status (succeeded/hasMore for tokens.length == 20)", async () => {
      // spy on the method used to fetch
      // mock resolved value
      const dummyToken = "testToken";
      const resValue = {
        vetted: { public: Array(20).fill(dummyToken) },
        unvetted: {},
      };
      fetchRecordsInventorySpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchRecordsInventory(params));

      const objAfterTransformation = {
        state: params.recordsState,
        status: params.status,
        page: params.page,
      };

      expect(fetchRecordsInventorySpy).toBeCalledWith(objAfterTransformation);
      const state = store.getState();
      expect(state.vetted.public.tokens).toEqual(Array(20).fill(dummyToken));
      expect(state.vetted.public.lastPage).toEqual(1);
      expect(state.vetted.public.status).toEqual("succeeded/hasMore");
    });
  });
  describe("when fetchRecordsInventory fails", () => {
    it("dispatches failure and update the error", async () => {
      const error = new Error("FAIL!");
      const objAfterTransformation = {
        state: params.recordsState,
        status: params.status,
        page: params.page,
      };
      fetchRecordsInventorySpy.mockRejectedValue(error);
      await store.dispatch(fetchRecordsInventory(params));
      expect(fetchRecordsInventorySpy).toBeCalledWith(objAfterTransformation);
      const state = store.getState();
      expect(state.vetted.public.tokens).toEqual([]);
      expect(state.vetted.public.lastPage).toEqual(0);
      expect(state.status).toEqual("failed");
      expect(state.error).toEqual("FAIL!");
    });
  });
});
