import { configureStore } from "@reduxjs/toolkit";
import * as api from "./api";
import reducer, {
  fetchPiPolicy,
  fetchPiSummaries,
  initialState,
} from "./piSlice";

const mockSummaryResponse = {
  status: "under-review",
};
const mockPolicy = {
  textfilesizemax: 524288,
  imagefilecountmax: 5,
  imagefilesizemax: 524288,
  namelengthmin: 8,
  namelengthmax: 80,
  amountmin: 100,
  amountmax: 100000000,
  startdatemin: 604800,
  enddatemax: 31557600,
  domains: ["development", "marketing", "research", "design"],
  summariespagesize: 5,
  billingstatuschangespagesize: 5,
  billingstatuschangesmax: 1,
};

// Pi Summaries
describe("Given fetchPiSummaries from piSlice", () => {
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
      expect(state.summaries.status).toEqual("failed");
      expect(state.summaries.error).toEqual("ERROR");
    });
  });
});

// PI Policy
describe("Given fetchPiPolicy from piSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchPiPolicySpy;
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { pi: reducer } });
    fetchPiPolicySpy = jest.spyOn(api, "fetchPolicy");
  });
  afterEach(() => {
    fetchPiPolicySpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when fetchPiPolicy dispatches", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchPiPolicy());

      expect(fetchPiPolicySpy).toBeCalled();
      const state = store.getState().pi;
      expect(state.policy.policy).toEqual({});
      expect(state.policy.status).toEqual("loading");
    });
  });
  describe("when fetchPiPolicy succeeds", () => {
    it("should update policy and status", async () => {
      fetchPiPolicySpy.mockResolvedValueOnce(mockPolicy);

      await store.dispatch(fetchPiPolicy());

      expect(fetchPiPolicySpy).toBeCalled();
      const state = store.getState().pi;
      expect(state.policy.policy).toEqual(mockPolicy);
      expect(state.policy.status).toEqual("succeeded");
    });
  });
  describe("when fetchPiPolicy fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchPiPolicySpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchPiPolicy());

      expect(fetchPiPolicySpy).toBeCalled();
      const state = store.getState().pi;
      expect(state.policy.status).toEqual("failed");
      expect(state.policy.error).toEqual("ERROR");
    });
  });
});
