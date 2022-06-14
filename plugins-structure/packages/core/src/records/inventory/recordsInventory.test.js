import recordsInventoryReducer, {
  fetchRecordsInventory,
  initialState,
} from "./recordsInventorySlice";
import recordsReducer from "../records/recordsSlice";
import recordsPolicyReducer from "../policy/policySlice";
import { configureStore } from "@reduxjs/toolkit";
import { getRecordsUserError } from "../errors";
import { client } from "../../client";

describe("Given the recordsInventorySlice", () => {
  let store;
  let preloadedStore;
  // spy on methods used to fetch
  let fetchRecordsInventorySpy;
  let fetchRecordsSpy;
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
        records: recordsReducer,
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
    fetchRecordsSpy = jest.spyOn(client, "fetchRecords");
  });
  afterEach(() => {
    fetchRecordsInventorySpy.mockRestore();
    fetchRecordsSpy.mockRestore();
  });
  describe("when empty parameters", () => {
    it("should return the initial state", () => {
      expect(recordsInventoryReducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when no policy is loaded", () => {
    it("should not fetch records inventory not fire actions", async () => {
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

    describe("when invalid params are passed to fetchRecordsInventory", () => {
      it("should not fetch nor fire actions", async () => {
        const badParams = {
          status: 2,
          page: 1,
        };

        const consoleErrorMock = jest
          .spyOn(console, "error")
          .mockImplementation();

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
    describe("when policy is loaded, given the fetchRecordsInventory", () => {
      beforeEach(() => {
        preloadedStore = configureStore({
          reducer: {
            recordsInventory: recordsInventoryReducer,
            recordsPolicy: recordsPolicyReducer,
            records: recordsReducer,
          },
          preloadedState: {
            records: {
              records: {},
              status: "idle",
              error: null,
            },
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
          preloadedStore.dispatch(fetchRecordsInventory(params));

          const objAfterTransformation = {
            state: params.recordsState,
            status: params.status,
            page: params.page,
          };

          expect(fetchRecordsInventorySpy).toBeCalledWith(
            objAfterTransformation
          );
          const state = preloadedStore.getState();
          expect(state.recordsInventory.vetted.public.tokens).toEqual([]);
          expect(state.recordsInventory.vetted.public.lastPage).toEqual(0);
          expect(state.recordsInventory.vetted.public.status).toEqual(
            "loading"
          );
        });
      });
      describe("when fetchRecordsInventory succeeds", () => {
        it("should update tokens, last page and status (succeeded/isDone for tokens.length < inventorypagesize)", async () => {
          const resValue = { vetted: { public: [] }, unvetted: {} };
          fetchRecordsInventorySpy.mockResolvedValueOnce(resValue);

          await preloadedStore.dispatch(fetchRecordsInventory(params));

          const objAfterTransformation = {
            state: params.recordsState,
            status: params.status,
            page: params.page,
          };

          expect(fetchRecordsInventorySpy).toBeCalledWith(
            objAfterTransformation
          );
          const state = preloadedStore.getState();
          expect(state.recordsInventory.vetted.public.tokens).toEqual([]);
          expect(state.recordsInventory.vetted.public.lastPage).toEqual(1);
          expect(state.recordsInventory.vetted.public.status).toEqual(
            "succeeded/isDone"
          );
        });

        it("should update tokens, last page and status (succeeded/hasMore for tokens.length == inventorypagesize)", async () => {
          const inventoryPageSize =
            preloadedStore.getState().recordsPolicy.policy.inventorypagesize;
          const publicTokens = Array(inventoryPageSize)
            .fill("")
            .map((_, i) => `testToken-${i}`);
          const resValue = {
            vetted: { public: publicTokens },
            unvetted: {},
          };
          fetchRecordsInventorySpy.mockResolvedValueOnce(resValue);

          await preloadedStore.dispatch(fetchRecordsInventory(params));

          const objAfterTransformation = {
            state: params.recordsState,
            status: params.status,
            page: params.page,
          };

          expect(fetchRecordsInventorySpy).toBeCalledWith(
            objAfterTransformation
          );
          const state = preloadedStore.getState();
          expect(state.recordsInventory.vetted.public.tokens).toEqual(
            publicTokens
          );
          expect(state.recordsInventory.vetted.public.lastPage).toEqual(1);
          expect(state.recordsInventory.vetted.public.status).toEqual(
            "succeeded/hasMore"
          );
        });
        it("should avoid duplicate tokens", async () => {
          const inventoryPageSize =
            preloadedStore.getState().recordsPolicy.policy.inventorypagesize;
          const publicTokens = Array(inventoryPageSize).fill("fakeToken");
          const resValue = {
            vetted: { public: publicTokens },
            unvetted: {},
          };
          fetchRecordsInventorySpy.mockResolvedValue(resValue);

          await preloadedStore.dispatch(fetchRecordsInventory(params));

          const objAfterTransformation = {
            state: params.recordsState,
            status: params.status,
            page: params.page,
          };

          expect(fetchRecordsInventorySpy).toBeCalledWith(
            objAfterTransformation
          );
          let state = preloadedStore.getState();
          expect(state.recordsInventory.vetted.public.tokens).toEqual([
            "fakeToken",
          ]);
          expect(state.recordsInventory.vetted.public.lastPage).toEqual(1);
          expect(state.recordsInventory.vetted.public.status).toEqual(
            "succeeded/hasMore"
          );
          // duplicate request
          await preloadedStore.dispatch(fetchRecordsInventory(params));
          state = preloadedStore.getState();
          expect(state.recordsInventory.vetted.public.tokens).toEqual([
            "fakeToken",
          ]);
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
          expect(fetchRecordsInventorySpy).toBeCalledWith(
            objAfterTransformation
          );
          const state = preloadedStore.getState();
          expect(state.recordsInventory.vetted.public.tokens).toEqual([]);
          expect(state.recordsInventory.vetted.public.lastPage).toEqual(0);
          expect(state.recordsInventory.status).toEqual("failed");
          expect(state.recordsInventory.error).toEqual("FAIL!");
        });
        it("should return correct user error messages", async () => {
          const errorcodes = Array(20)
            .fill()
            .map((_, i) => i + 1);
          for (const errorcode of errorcodes) {
            const error = { body: { errorcode } };
            const message = getRecordsUserError(errorcode);
            fetchRecordsInventorySpy.mockRejectedValueOnce(error);
            await preloadedStore.dispatch(fetchRecordsInventory(params));
            expect(fetchRecordsInventorySpy).toBeCalled();
            const state = preloadedStore.getState().recordsInventory;
            expect(state.status).toEqual("failed");
            expect(state.error).toEqual(message);
          }
        });
      });
    });
  });
});
