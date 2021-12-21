import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, { fetchTicketvotePolicy, initialState } from "./policySlice";

const mockPolicy = {
  linkbyperiodmin: 1,
  linkbyperiodmax: 7776000,
  votedurationmin: 1,
  votedurationmax: 4032,
  summariespagesize: 5,
  inventorypagesize: 20,
  timestampspagesize: 100,
};

describe("Given the policySlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchPolicySpy;
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { ticketvotePolicy: reducer } });
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
  describe("when fetchTicketvotePolicy dispatches", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchTicketvotePolicy());

      expect(fetchPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvotePolicy.policy).toEqual({});
      expect(state.ticketvotePolicy.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvotePolicy succeeds", () => {
    it("should update policy and status", async () => {
      fetchPolicySpy.mockResolvedValueOnce(mockPolicy);

      await store.dispatch(fetchTicketvotePolicy());

      expect(fetchPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvotePolicy.policy).toEqual(mockPolicy);
      expect(state.ticketvotePolicy.status).toEqual("succeeded");
    });
  });
  describe("when fetchTicketvotePolicy fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchPolicySpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchTicketvotePolicy());

      expect(fetchPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvotePolicy.status).toEqual("failed");
      expect(state.ticketvotePolicy.error).toEqual("ERROR");
    });
  });
});
