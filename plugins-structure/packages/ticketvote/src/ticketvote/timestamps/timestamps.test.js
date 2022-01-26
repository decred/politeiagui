import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, {
  fetchTicketvoteTimestamps,
  initialState,
} from "./timestampsSlice";
import policyReducer from "../policy/policySlice";

describe("Given the timestampsSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchTimestampsSpy;
  const params = {
    token: "fakeToken",
  };
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({
      reducer: {
        ticketvoteTimestamps: reducer,
        ticketvotePolicy: policyReducer,
      },
      preloadedState: {
        ticketvotePolicy: {
          policy: {
            timestampspagesize: 100,
          },
        },
      },
    });
    fetchTimestampsSpy = jest.spyOn(api, "fetchTimestamps");
  });
  afterEach(() => {
    fetchTimestampsSpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when invalid token is passed to fetchTicketvoteTimestamps", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchTicketvoteTimestamps(invalidParams));
      expect(fetchTimestampsSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({});
      expect(state.ticketvoteTimestamps.status).toEqual("idle");
    });
  });
  describe("when fetchTicketvoteTimestamps dispatches without policy", () => {
    it("should update the status to failed and log error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      store = configureStore({ reducer: { ticketvoteTimestamps: reducer } });

      await store.dispatch(fetchTicketvoteTimestamps(params));
      expect(fetchTimestampsSpy).not.toBeCalled();
      expect(consoleErrorSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({});
      expect(state.ticketvoteTimestamps.status).toEqual("failed");
    });
  });
  describe("when fetchTicketvoteTimestamps dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchTicketvoteTimestamps(params));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({});
      expect(state.ticketvoteTimestamps.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteTimestamps succeeds", () => {
    it("should update byToken and status", async () => {
      const resValue = {};
      fetchTimestampsSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteTimestamps(params));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({
        fakeToken: resValue,
      });
      expect(state.ticketvoteTimestamps.status).toEqual("succeeded");
    });
  });
  describe("when fetchTicketvoteTimestamps fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchTimestampsSpy.mockRejectedValue(error);

      await store.dispatch(fetchTicketvoteTimestamps(params));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.status).toEqual("failed");
      expect(state.ticketvoteTimestamps.error).toEqual("ERROR");
    });
  });
});
