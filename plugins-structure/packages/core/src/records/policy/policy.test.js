import { configureStore } from "@reduxjs/toolkit";
import reducer, { fetchRecordsPolicy, initialState } from "./policySlice";
import { client } from "../../client";

const mockPolicy = {
  "recordspagesize": 5,
  "inventorypagesize": 20
};

describe("Given the policySlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchPolicySpy;
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { recordsPolicy: reducer } });
    fetchPolicySpy = jest.spyOn(client, "fetchPolicy");
  });
  afterEach(() => {
    fetchPolicySpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when fetchRecordsPolicy dispatches", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchRecordsPolicy());

      expect(fetchPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.recordsPolicy.policy).toEqual({});
      expect(state.recordsPolicy.status).toEqual("loading");
    });
  });
  describe("when fetchRecordsPolicy succeeds", () => {
    it("should update policy and status", async () => {
      fetchPolicySpy.mockResolvedValueOnce(mockPolicy);

      await store.dispatch(fetchRecordsPolicy());

      expect(fetchPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.recordsPolicy.policy).toEqual(mockPolicy);
      expect(state.recordsPolicy.status).toEqual("succeeded");
    });
  });
  describe("when fetchRecordsPolicy fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchPolicySpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchRecordsPolicy());

      expect(fetchPolicySpy).toBeCalled();
      const state = store.getState();
      expect(state.recordsPolicy.status).toEqual("failed");
      expect(state.recordsPolicy.error).toEqual("ERROR");
    });
  });
});
