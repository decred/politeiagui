import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, {
  fetchTicketvoteSummaries,
  fetchTicketvoteSummariesNextPage,
  initialState,
} from "./summariesSlice";
import policyReducer from "../policy/policySlice";

const mockSummaryResponse = {
  type: 0,
  status: 1,
  duration: 0,
  startblockheight: 0,
  startblockhash: "",
  endblockheight: 0,
  eligibletickets: 0,
  quorumpercentage: 0,
  passpercentage: 0,
  results: [],
  bestblock: 67,
};

describe("Given the summariesSlice", () => {
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
        ticketvoteSummaries: reducer,
        ticketvotePolicy: policyReducer,
      },
      preloadedState: {
        ticketvotePolicy: {
          policy: {
            summariespagesize: 5,
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
  describe("when invalid token is passed to fetchTicketvoteSummaries", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchTicketvoteSummaries(invalidParams));
      expect(fetchSummariesSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteSummaries.byToken).toEqual({});
      expect(state.ticketvoteSummaries.status).toEqual("idle");
    });
  });
  describe("when policy isn't loaded before dispatching fetchTicketvoteSummaries", () => {
    it("should update the status to failed and log error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      store = configureStore({ reducer: { ticketvoteSummaries: reducer } });
      await store.dispatch(fetchTicketvoteSummaries(params));
      expect(fetchSummariesSpy).not.toBeCalled();
      expect(consoleErrorSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteSummaries.byToken).toEqual({});
      expect(state.ticketvoteSummaries.status).toEqual("failed");

      consoleErrorSpy.mockRestore();
    });
  });
  describe("when fetchTicketvoteSummaries dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchTicketvoteSummaries(params));

      expect(fetchSummariesSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteSummaries.byToken).toEqual({});
      expect(state.ticketvoteSummaries.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteSummaries succeeds", () => {
    it("should update byToken and status", async () => {
      const resValue = {
        fakeToken: mockSummaryResponse,
        fakeToken2: mockSummaryResponse,
      };
      fetchSummariesSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteSummaries(params));

      expect(fetchSummariesSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteSummaries.byToken).toEqual(resValue);
      expect(state.ticketvoteSummaries.status).toEqual("succeeded");
    });
  });
  describe("when fetchTicketvoteSummaries fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchSummariesSpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchTicketvoteSummaries(params));

      expect(fetchSummariesSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteSummaries.status).toEqual("failed");
      expect(state.ticketvoteSummaries.error).toEqual("ERROR");
    });
  });
  describe("when fetchTicketvoteSummariesNextPage is called with an empty queue", () => {
    it("should not fetch nor fire actions", async () => {
      await store.dispatch(fetchTicketvoteSummariesNextPage());

      expect(fetchSummariesSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteSummaries.byToken).toEqual({});
      expect(state.ticketvoteSummaries.status).toEqual("idle");
    });
  });
  describe("when fetchTicketvoteSummariesNextPage dispatches with valid queue", () => {
    const tokens = ["abc", "def", "ghi", "jkl", "mno"];
    it("should update status to loading", () => {
      store = configureStore({
        reducer: {
          ticketvoteSummaries: reducer,
          ticketvotePolicy: policyReducer,
        },
        preloadedState: {
          ticketvotePolicy: {
            policy: { summariespagesize: 5 },
          },
          ticketvoteSummaries: {
            summariesFetchQueue: { tokens, status: "idle" },
          },
        },
      });
      store.dispatch(fetchTicketvoteSummariesNextPage());

      expect(fetchSummariesSpy).toBeCalled();
      const state = store.getState().ticketvoteSummaries;
      expect(state.summariesFetchQueue.tokens).toEqual(tokens);
      expect(state.summariesFetchQueue.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteSummariesNextPage succeeds and all tokens are fetched", () => {
    const tokens = ["abc", "def", "ghi", "jkl", "mno"];
    it("should update status to succeeded/isDone", async () => {
      store = configureStore({
        reducer: {
          ticketvoteSummaries: reducer,
          ticketvotePolicy: policyReducer,
        },
        preloadedState: {
          ticketvotePolicy: {
            policy: { summariespagesize: 5 },
          },
          ticketvoteSummaries: {
            summariesFetchQueue: { tokens, status: "idle" },
          },
        },
      });
      await store.dispatch(fetchTicketvoteSummariesNextPage());

      expect(fetchSummariesSpy).toBeCalled();
      const state = store.getState().ticketvoteSummaries;
      expect(state.summariesFetchQueue.tokens).toEqual([]);
      expect(state.summariesFetchQueue.status).toEqual("succeeded/isDone");
    });
  });
  describe("when fetchTicketvoteSummariesNextPage succeeds and queue.length > summariespagesize", () => {
    const tokens = ["abc", "def", "ghi", "jkl", "mno", "pqr", "tuv"];
    it("should update status to succeeded/hasMore", async () => {
      store = configureStore({
        reducer: {
          ticketvoteSummaries: reducer,
          ticketvotePolicy: policyReducer,
        },
        preloadedState: {
          ticketvotePolicy: {
            policy: { summariespagesize: 5 },
          },
          ticketvoteSummaries: {
            summariesFetchQueue: { tokens, status: "idle" },
          },
        },
      });
      await store.dispatch(fetchTicketvoteSummariesNextPage());

      expect(fetchSummariesSpy).toBeCalled();
      const state = store.getState().ticketvoteSummaries;
      expect(state.summariesFetchQueue.tokens).toEqual(["pqr", "tuv"]);
      expect(state.summariesFetchQueue.status).toEqual("succeeded/hasMore");
    });
  });
});
