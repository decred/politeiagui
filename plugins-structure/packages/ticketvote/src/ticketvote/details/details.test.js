import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import {
  getTicketvotePluginErrorMessage,
  getTicketvoteUserErrorMessage,
} from "../../lib/errors";
import reducer, { fetchTicketvoteDetails, initialState } from "./detailsSlice";

describe("Given the detailsSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchDetailsSpy;
  const params = {
    token: "fakeToken",
  };
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { ticketvoteDetails: reducer } });
    fetchDetailsSpy = jest.spyOn(api, "fetchDetails");
  });
  afterEach(() => {
    fetchDetailsSpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when invalid token is passed to fetchTicketvoteDetails", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchTicketvoteDetails(invalidParams));
      expect(fetchDetailsSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteDetails.byToken).toEqual({});
      expect(state.ticketvoteDetails.status).toEqual("idle");
    });
  });
  describe("when fetchTicketvoteDetails dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchTicketvoteDetails(params));

      expect(fetchDetailsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteDetails.byToken).toEqual({});
      expect(state.ticketvoteDetails.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteDetails succeeds", () => {
    it("should update byToken and status", async () => {
      const resValue = { auths: [], vote: {} };
      fetchDetailsSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchTicketvoteDetails(params));

      expect(fetchDetailsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteDetails.byToken).toEqual({ fakeToken: resValue });
      expect(state.ticketvoteDetails.status).toEqual("succeeded");
    });
  });
  describe("when fetchTicketvoteDetails fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchDetailsSpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchTicketvoteDetails(params));

      expect(fetchDetailsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteDetails.status).toEqual("failed");
      expect(state.ticketvoteDetails.error).toEqual("ERROR");
    });
    it("should return correct plugin error messages", async () => {
      const errorcodes = Array(20)
        .fill()
        .map((_, i) => i + 1);
      for (const errorcode of errorcodes) {
        const error = { body: { errorcode, pluginid: "ticketvote" } };
        const message = getTicketvotePluginErrorMessage(errorcode);
        fetchDetailsSpy.mockRejectedValueOnce(error);
        await store.dispatch(fetchTicketvoteDetails(params));
        expect(fetchDetailsSpy).toBeCalled();
        const state = store.getState().ticketvoteDetails;
        expect(state.status).toEqual("failed");
        expect(state.error).toEqual(message);
      }
    });
    it("should return correct user error messages", async () => {
      const errorcodes = Array(9)
        .fill()
        .map((_, i) => i);
      for (const errorcode of errorcodes) {
        const error = { body: { errorcode } };
        const message = getTicketvoteUserErrorMessage(errorcode);
        fetchDetailsSpy.mockRejectedValueOnce(error);
        await store.dispatch(fetchTicketvoteDetails(params));
        expect(fetchDetailsSpy).toBeCalled();
        const state = store.getState().ticketvoteDetails;
        expect(state.status).toEqual("failed");
        expect(state.error).toEqual(message);
      }
    });
  });
});
