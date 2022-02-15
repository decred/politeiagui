import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, {
  fetchTicketvoteSubmissions,
  initialState,
} from "./submissionsSlice";

describe("Given the submissionsSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchSubmissionsSpy;
  const params = {
    token: "fakeToken",
  };
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { ticketvoteSubmissions: reducer } });
    fetchSubmissionsSpy = jest.spyOn(api, "fetchSubmissions");
  });
  afterEach(() => {
    fetchSubmissionsSpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when invalid token is passed to fetchTicketvoteSubmissions", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchTicketvoteSubmissions(invalidParams));
      expect(fetchSubmissionsSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteSubmissions.byToken).toEqual({});
      expect(state.ticketvoteSubmissions.status).toEqual("idle");
    });
  });
  describe("when fetchTicketvoteSubmissions dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchTicketvoteSubmissions(params));

      expect(fetchSubmissionsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteSubmissions.byToken).toEqual({});
      expect(state.ticketvoteSubmissions.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteSubmissions succeeds", () => {
    it("should update byToken and status", async () => {
      const resValue = { submissions: ["fakeSubmission"] };
      fetchSubmissionsSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteSubmissions(params));

      expect(fetchSubmissionsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteSubmissions.byToken).toEqual({
        fakeToken: ["fakeSubmission"],
      });
      expect(state.ticketvoteSubmissions.status).toEqual("succeeded");
    });
  });
  describe("when fetchTicketvoteSubmissions fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchSubmissionsSpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchTicketvoteSubmissions(params));

      expect(fetchSubmissionsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteSubmissions.status).toEqual("failed");
      expect(state.ticketvoteSubmissions.error).toEqual("ERROR");
    });
  });
});
