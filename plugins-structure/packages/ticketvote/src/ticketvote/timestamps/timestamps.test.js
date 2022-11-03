import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import {
  getTicketvotePluginErrorMessage,
  getTicketvoteUserErrorMessage,
} from "../../lib/errors";
import reducer, {
  fetchAllTicketvoteTimestamps,
  fetchTicketvoteTimestamps,
  initialState,
} from "./timestampsSlice";
import policyReducer from "../policy/policySlice";

const timestampspagesize = 100;

describe("Given the timestampsSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchTimestampsSpy;
  const mockAuthDetails = {
    auths: [
      {
        data: "Auths",
      },
    ],
    details: {
      data: "tokens",
    },
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
            timestampspagesize,
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
      expect(state.ticketvoteTimestamps.status).toEqual("idle");
    });
  });
  describe("when fetchTicketvoteTimestamps dispatches without policy", () => {
    it("should update the status to failed and log error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      store = configureStore({ reducer: { ticketvoteTimestamps: reducer } });

      await store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));
      expect(fetchTimestampsSpy).not.toBeCalled();
      expect(consoleErrorSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.status).toEqual("failed");

      consoleErrorSpy.mockRestore();
    });
  });
  describe("when fetchTicketvoteTimestamps dispatches with valid params", () => {
    it("should update the status to loading", () => {
      fetchTimestampsSpy.mockResolvedValueOnce(mockAuthDetails);

      store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteTimestamps succeeds", () => {
    it("should update status to succeeded", async () => {
      fetchTimestampsSpy.mockResolvedValueOnce(mockAuthDetails);

      await store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.status).toEqual("succeeded");
    });
    it("should fetch N+1 requests when votesPage is N", async () => {
      fetchTimestampsSpy.mockResolvedValueOnce(mockAuthDetails);

      await store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));
      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.status).toEqual("succeeded");
    });
  });
  describe("when fetchTicketvoteTimestamps fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchTimestampsSpy.mockRejectedValue(error);

      await store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.status).toEqual("failed");
      expect(state.ticketvoteTimestamps.error).toEqual("ERROR");
    });
    it("should return correct plugin error messages", async () => {
      const errorcodes = Array(20)
        .fill()
        .map((_, i) => i + 1);
      for (const errorcode of errorcodes) {
        const error = { body: { errorcode, pluginid: "ticketvote" } };
        const message = getTicketvotePluginErrorMessage(errorcode);
        fetchTimestampsSpy.mockRejectedValueOnce(error);
        await store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));
        expect(fetchTimestampsSpy).toBeCalled();
        const state = store.getState().ticketvoteTimestamps;
        expect(state.status).toEqual("failed");
        expect(state.error).toEqual(message);
      }
    });
    it("should return correct user error messages", async () => {
      const errorcodes = Array(9)
        .fill()
        .map((_, i) => i + 1);
      for (const errorcode of errorcodes) {
        const error = { body: { errorcode } };
        const message = getTicketvoteUserErrorMessage(errorcode);
        fetchTimestampsSpy.mockRejectedValueOnce(error);
        await store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));
        expect(fetchTimestampsSpy).toBeCalled();
        const state = store.getState().ticketvoteTimestamps;
        expect(state.status).toEqual("failed");
        expect(state.error).toEqual(message);
      }
    });
  });
  describe("when fetchAllTicketvoteTimestamps is called with votesCount", () => {
    it("should be called `votesCount/timestampsPageSize`+1 times", async () => {
      fetchTimestampsSpy.mockResolvedValue(mockAuthDetails);
      const votesCount = 10 * timestampspagesize;

      await store.dispatch(
        fetchAllTicketvoteTimestamps({ token: "fakeToken", votesCount })
      );

      expect(fetchTimestampsSpy).toBeCalledTimes(
        votesCount / timestampspagesize + 1
      );
      const state = store.getState();
      expect(state.ticketvoteTimestamps.status).toEqual("succeeded");
    });
  });
  describe("when fetchAllTicketvoteTimestamps fails", () => {
    it("should only call first batch", async () => {
      const error = new Error("ERROR");
      fetchTimestampsSpy.mockRejectedValue(error);
      const votesCount = 10 * timestampspagesize;

      await store.dispatch(
        fetchAllTicketvoteTimestamps({ token: "fakeToken", votesCount })
      );

      expect(fetchTimestampsSpy).toBeCalledTimes(5);
      const state = store.getState();
      expect(state.ticketvoteTimestamps.status).toEqual("failed");
    });
  });
});
