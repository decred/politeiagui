import { configureStore } from "@reduxjs/toolkit";
import * as api from "./api";
import reducer, { fetchPiSummaries, initialState } from "./piSlice";

const mockSummaryResponse = {
  status: "under-review",
};

describe("Given piSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchSummariesSpy;
  const params = {
    tokens: ["fakeToken", "fakeToken2"],
  };
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({
      reducer: {
        pi: reducer,
      },
      preloadedState: {
        pi: {
          ...initialState,
          policy: {
            policy: {
              summariespagesize: 5,
            },
          },
        },
      },
    });
    fetchSummariesSpy = jest.spyOn(api, "fetchSummaries");
  });
  afterEach(() => {
    fetchSummariesSpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when invalid token is passed to fetchPiSummaries", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};
      await store.dispatch(fetchPiSummaries(invalidParams));
      expect(fetchSummariesSpy).not.toBeCalled();
      const state = store.getState().pi;
      expect(state.summaries.byToken).toEqual({});
      expect(state.summaries.status).toEqual("idle");
    });
  });
  describe("when policy isn't loaded before dispatching fetchPiSummaries", () => {
    it("should update the status to failed and log error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      store = configureStore({ reducer: { pi: reducer } });
      await store.dispatch(fetchPiSummaries(params));
      expect(fetchSummariesSpy).not.toBeCalled();
      expect(consoleErrorSpy).toBeCalled();
      const state = store.getState().pi;
      expect(state.summaries.byToken).toEqual({});
      expect(state.summaries.status).toEqual("failed");

      consoleErrorSpy.mockRestore();
    });
  });
  describe("when fetchPiSummaries dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchPiSummaries(params));

      expect(fetchSummariesSpy).toBeCalled();
      const state = store.getState().pi;
      expect(state.summaries.byToken).toEqual({});
      expect(state.summaries.status).toEqual("loading");
    });
  });
  describe("when fetchPiSummaries succeeds", () => {
    it("should update byToken and status", async () => {
      const resValue = {
        summaries: {
          fakeToken: mockSummaryResponse,
          fakeToken2: mockSummaryResponse,
        },
      };
      fetchSummariesSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchPiSummaries(params));

      expect(fetchSummariesSpy).toBeCalled();
      const state = store.getState().pi;
      expect(state.summaries.byToken).toEqual(resValue.summaries);
      expect(state.summaries.status).toEqual("succeeded");
    });
  });
  describe("when fetchPiSummaries fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchSummariesSpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchPiSummaries(params));

      expect(fetchSummariesSpy).toBeCalled();
      const state = store.getState().pi;
      console.log("STATE:", state);
      expect(state.summaries.status).toEqual("failed");
      expect(state.summaries.error).toEqual("ERROR");
    });
  });
});
