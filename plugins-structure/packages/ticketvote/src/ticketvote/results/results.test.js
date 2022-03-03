import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, { fetchTicketvoteResults, initialState } from "./resultsSlice";

describe("Given the resultsSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchResultsSpy;
  const params = {
    token: "fakeToken",
  };
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { ticketvoteResults: reducer } });
    fetchResultsSpy = jest.spyOn(api, "fetchResults");
  });
  afterEach(() => {
    fetchResultsSpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when invalid token is passed to fetchTicketvoteResults", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchTicketvoteResults(invalidParams));
      expect(fetchResultsSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteResults.byToken).toEqual({});
      expect(state.ticketvoteResults.status).toEqual("idle");
    });
  });
  describe("when fetchTicketvoteResults dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchTicketvoteResults(params));

      expect(fetchResultsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteResults.byToken).toEqual({});
      expect(state.ticketvoteResults.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteResults succeeds", () => {
    it("should update byToken and status", async () => {
      const resValue = { votes: [] };
      fetchResultsSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteResults(params));

      expect(fetchResultsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteResults.byToken).toEqual({ fakeToken: resValue });
      expect(state.ticketvoteResults.status).toEqual("succeeded");
    });
  });
  describe("when fetchTicketvoteResults fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchResultsSpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchTicketvoteResults(params));

      expect(fetchResultsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteResults.status).toEqual("failed");
      expect(state.ticketvoteResults.error).toEqual("ERROR");
    });
  });
});
