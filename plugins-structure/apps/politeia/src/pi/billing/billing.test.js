import { configureStore } from "@reduxjs/toolkit";
import * as api from "../lib/api";
import reducer, {
  fetchBillingStatusChanges,
  initialState,
} from "./billingSlice";
import policyReducer from "../policy/policySlice";

const mockBillingResponse = [
  {
    token: "0b40715ced95bb13",
    status: 3,
    publickey:
      "51a5877c828cbc61fa609e12167ec78ec506998928d787235961ab11f185a618",
    signature:
      "ac14aa4c1ceba895a320b964dde059869e17bd0af0f6f2ec50f5e325cc61e12085f10d72a16d45c0cdd9feae4d12fed3862e3fa214f022b09914e255b8e3ab08",
    receipt:
      "ceb536ed55db7c0ddbaa8b137f008be4220b15d6efe143cdcdaa60ce5a34bb8d29f2258d70a62d4eafef3db91bfe4cb101287c1c44583880a8059512f59b7a09",
    timestamp: 1658415512,
  },
];

// Pi Billing
describe("Given fetchBillingStatusChanges from billing service", () => {
  let store;
  let fetchBillingStatusChangesSpy;
  const params = {
    tokens: ["fakeToken", "fakeToken2"],
  };
  beforeEach(() => {
    store = configureStore({
      reducer: {
        piBilling: reducer,
        piPolicy: policyReducer,
      },
      preloadedState: {
        piPolicy: {
          policy: {
            billingstatuschangespagesize: 5,
          },
        },
      },
    });
    fetchBillingStatusChangesSpy = jest.spyOn(api, "fetchBillingStatusChanges");
  });
  afterEach(() => {
    fetchBillingStatusChangesSpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when policy isn't loaded before dispatching fetchBillingStatusChanges", () => {
    it("should update the status to failed and log error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      store = configureStore({ reducer: { piBilling: reducer } });
      await store.dispatch(fetchBillingStatusChanges(params));
      expect(fetchBillingStatusChangesSpy).not.toBeCalled();
      expect(consoleErrorSpy).toBeCalled();
      const state = store.getState().piBilling;
      expect(state.byToken).toEqual({});
      expect(state.status).toEqual("failed");

      consoleErrorSpy.mockRestore();
    });
  });
  describe("when fetchBillingStatusChanges dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchBillingStatusChanges(params));

      expect(fetchBillingStatusChangesSpy).toBeCalled();
      const state = store.getState().piBilling;
      expect(state.byToken).toEqual({});
      expect(state.status).toEqual("loading");
    });
  });
  describe("when fetchBillingStatusChanges succeeds", () => {
    it("should update byToken and status", async () => {
      const resValue = {
        billingstatuschanges: {
          fakeToken: mockBillingResponse,
          fakeToken2: mockBillingResponse,
        },
      };
      fetchBillingStatusChangesSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchBillingStatusChanges(params));

      expect(fetchBillingStatusChangesSpy).toBeCalled();
      const state = store.getState().piBilling;
      expect(state.byToken).toEqual(resValue.billingstatuschanges);
      expect(state.status).toEqual("succeeded");
    });
  });
  describe("when fetchBillingStatusChanges fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchBillingStatusChangesSpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchBillingStatusChanges(params));

      expect(fetchBillingStatusChangesSpy).toBeCalled();
      const state = store.getState().piBilling;
      expect(state.status).toEqual("failed");
      expect(state.error).toEqual("ERROR");
    });
  });
});
