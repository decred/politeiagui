import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, { fetchCommentsPolicy, initialState } from "./policySlice";

const mockPolicy = {
  lengthmax: 8000,
  votechangesmax: 5,
  countpagesize: 10,
  timestampspagesize: 100,
};

describe("Given the policySlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchPolicySpy;
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { commentsPolicy: reducer } });
    fetchPolicySpy = jest.spyOn(api, "fetchPolicy");
  });
  afterEach(() => {
    fetchPolicySpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when fetchCommentsPolicy dispatches", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchCommentsPolicy());

      expect(fetchPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsPolicy.policy).toEqual({});
      expect(state.commentsPolicy.status).toEqual("loading");
    });
  });
  describe("when fetchCommentsPolicy succeeds", () => {
    it("should update policy and status", async () => {
      fetchPolicySpy.mockResolvedValueOnce(mockPolicy);

      await store.dispatch(fetchCommentsPolicy());

      expect(fetchPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsPolicy.policy).toEqual(mockPolicy);
      expect(state.commentsPolicy.status).toEqual("succeeded");
    });
  });
  describe("when fetchCommentsPolicy fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchPolicySpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchCommentsPolicy());

      expect(fetchPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsPolicy.status).toEqual("failed");
      expect(state.commentsPolicy.error).toEqual("ERROR");
    });
  });
});
