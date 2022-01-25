import recordsInventoryReducer, {
  fetchRecordsInventory,
  initialState,
} from "./recordsInventorySlice";
import recordsPolicyReducer from "../policy/policySlice";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "../../client";

describe("Given the recordsInventorySlice", () => {
  let store;
  let preloadedStore;
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
      reducer: {
        recordsInventory: recordsInventoryReducer,
        recordsPolicy: recordsPolicyReducer,
      },
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
      expect(recordsInventoryReducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when no policy is loaded", () => {
    it("should not fetch not fire actions", async () => {
      // spy on console error
      const consoleErrorMock = jest
        .spyOn(console, "error")
        .mockImplementation();

      await store.dispatch(fetchRecordsInventory(params));
      expect(consoleErrorMock).toBeCalledWith(
        Error(
          "Records policy should be loaded before fetching records or records inventory. See `usePolicy` hook"
        )
      );
      expect(fetchRecordsInventorySpy).not.toBeCalled();
      const state = store.getState();
      expect(state.recordsInventory.vetted.public.tokens).toEqual([]);
      expect(state.recordsInventory.vetted.public.lastPage).toEqual(0);
      expect(state.recordsInventory.vetted.public.status).toEqual("idle");
      consoleErrorMock.mockRestore();
    });
  });
  describe("when invalid params are passed to fetchRecordsInventory", () => {
    it("should not fetch nor fire actions", async () => {
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
      expect(state.recordsInventory.vetted.public.tokens).toEqual([]);
      expect(state.recordsInventory.vetted.public.lastPage).toEqual(0);
      expect(state.recordsInventory.vetted.public.status).toEqual("idle");
      consoleErrorMock.mockRestore();
    });
  });
  describe("when policy is loaded", () => {
    beforeEach(() => {
      preloadedStore = configureStore({
        reducer: {
          recordsInventory: recordsInventoryReducer,
          recordsPolicy: recordsPolicyReducer,
        },
        preloadedState: {
          recordsInventory: initialState,
          recordsPolicy: {
            policy: {
              inventorypagesize: 20,
              recordspagesize: 5,
            },
          },
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            // This will make the client available in the 'extra' argument
            // for all our thunks created with createAsyncThunk
            thunk: {
              extraArgument: client,
            },
          }),
      });
    });
    describe("when policy is loaded and fetchRecordsInventory dispatches", () => {
      it("should update the status to loading", () => {
        // do now await for store.dispatch since we want to test
        // loading
        preloadedStore.dispatch(fetchRecordsInventory(params));

        const objAfterTransformation = {
          state: params.recordsState,
          status: params.status,
          page: params.page,
        };

        expect(fetchRecordsInventorySpy).toBeCalledWith(objAfterTransformation);
        const state = preloadedStore.getState();
        expect(state.recordsInventory.vetted.public.tokens).toEqual([]);
        expect(state.recordsInventory.vetted.public.lastPage).toEqual(0);
        expect(state.recordsInventory.vetted.public.status).toEqual("loading");
      });
    });
    describe("when fetchRecordsInventory succeeds", () => {
      it("should update tokens, last page and status (succeeded/isDone for tokens.length < inventorypagesize)", async () => {
        // spy on the method used to fetch
        // mock resolved value
        const resValue = { vetted: { public: [] }, unvetted: {} };
        fetchRecordsInventorySpy.mockResolvedValueOnce(resValue);

        await preloadedStore.dispatch(fetchRecordsInventory(params));

        const objAfterTransformation = {
          state: params.recordsState,
          status: params.status,
          page: params.page,
        };

        expect(fetchRecordsInventorySpy).toBeCalledWith(objAfterTransformation);
        const state = preloadedStore.getState();
        expect(state.recordsInventory.vetted.public.tokens).toEqual([]);
        expect(state.recordsInventory.vetted.public.lastPage).toEqual(1);
        expect(state.recordsInventory.vetted.public.status).toEqual(
          "succeeded/isDone"
        );
      });

      it("should update tokens, last page and status (succeeded/hasMore for tokens.length == inventorypagesize)", async () => {
        // spy on the method used to fetch
        // mock resolved value
        const inventoryPageSize =
          preloadedStore.getState().recordsPolicy.policy.inventorypagesize;
        const dummyToken = "testToken";
        const resValue = {
          vetted: { public: Array(inventoryPageSize).fill(dummyToken) },
          unvetted: {},
        };
        fetchRecordsInventorySpy.mockResolvedValueOnce(resValue);

        await preloadedStore.dispatch(fetchRecordsInventory(params));

        const objAfterTransformation = {
          state: params.recordsState,
          status: params.status,
          page: params.page,
        };

        expect(fetchRecordsInventorySpy).toBeCalledWith(objAfterTransformation);
        const state = preloadedStore.getState();
        expect(state.recordsInventory.vetted.public.tokens).toEqual(
          Array(inventoryPageSize).fill(dummyToken)
        );
        expect(state.recordsInventory.vetted.public.lastPage).toEqual(1);
        expect(state.recordsInventory.vetted.public.status).toEqual(
          "succeeded/hasMore"
        );
      });
    });
    describe("when fetchRecordsInventory fails", () => {
      it("should dispatch failure and update the error", async () => {
        const error = new Error("FAIL!");
        const objAfterTransformation = {
          state: params.recordsState,
          status: params.status,
          page: params.page,
        };
        fetchRecordsInventorySpy.mockRejectedValue(error);
        await preloadedStore.dispatch(fetchRecordsInventory(params));
        expect(fetchRecordsInventorySpy).toBeCalledWith(objAfterTransformation);
        const state = preloadedStore.getState();
        expect(state.recordsInventory.vetted.public.tokens).toEqual([]);
        expect(state.recordsInventory.vetted.public.lastPage).toEqual(0);
        expect(state.recordsInventory.status).toEqual("failed");
        expect(state.recordsInventory.error).toEqual("FAIL!");
      });
    });
  });
});
