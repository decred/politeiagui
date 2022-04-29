import { configureStore } from "@reduxjs/toolkit";
import * as api from "../api";
import reducer, { fetchPiPolicy, initialState } from "./policySlice";

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
// PI Policy
describe("Given fetchPiPolicy from piSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchPiPolicySpy;
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { piPolicy: reducer } });
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
      const state = store.getState().piPolicy;
      expect(state.policy).toEqual({});
      expect(state.status).toEqual("loading");
    });
  });
  describe("when fetchPiPolicy succeeds", () => {
    it("should update policy and status", async () => {
      fetchPiPolicySpy.mockResolvedValueOnce(mockPolicy);

      await store.dispatch(fetchPiPolicy());

      expect(fetchPiPolicySpy).toBeCalled();
      const state = store.getState().piPolicy;
      expect(state.policy).toEqual(mockPolicy);
      expect(state.status).toEqual("succeeded");
    });
  });
  describe("when fetchPiPolicy fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchPiPolicySpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchPiPolicy());

      expect(fetchPiPolicySpy).toBeCalled();
      const state = store.getState().piPolicy;
      expect(state.status).toEqual("failed");
      expect(state.error).toEqual("ERROR");
    });
  });
});
