import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, {
  fetchAllCommentsTimestamps,
  fetchCommentsTimestamps,
  initialState,
} from "./timestampsSlice";
import policyReducer from "../policy/policySlice";

const timestampspagesize = 10;

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
      reducer: { commentsTimestamps: reducer, commentsPolicy: policyReducer },
      preloadedState: {
        commentsPolicy: {
          policy: { timestampspagesize },
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
  describe("when invalid token is passed to fetchCommentsTimestamps", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchCommentsTimestamps(invalidParams));
      expect(fetchTimestampsSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.commentsTimestamps.status).toEqual("idle");
    });
  });
  describe("when fetchCommentsTimestamps dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchCommentsTimestamps(params));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsTimestamps.status).toEqual("loading");
    });
  });
  describe("when fetchCommentsTimestamps succeeds", () => {
    it("should update byToken and status", async () => {
      const resValue = { comments: {} };
      fetchTimestampsSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchCommentsTimestamps(params));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsTimestamps.status).toEqual("succeeded");
    });
  });
  describe("when fetchCommentsTimestamps fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchTimestampsSpy.mockRejectedValue(error);

      await store.dispatch(fetchCommentsTimestamps(params));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsTimestamps.status).toEqual("failed");
      expect(state.commentsTimestamps.error).toEqual("ERROR");
    });
  });
  describe("when fetchAllCommentsTimestamps is called with N commentids", () => {
    it("should call fetchCommentsTimestamps N/timestampspagesize times", async () => {
      const resValue = { comments: {} };
      const count = 200;
      const commentids = Array(count)
        .fill("")
        .map((_, i) => i);
      fetchTimestampsSpy.mockResolvedValue(resValue);
      await store.dispatch(
        fetchAllCommentsTimestamps({ ...params, commentids })
      );

      expect(fetchTimestampsSpy).toBeCalledTimes(count / timestampspagesize);
      const state = store.getState();
      expect(state.commentsTimestamps.status).toEqual("succeeded");
    });
  });
  describe("when fetchAllCommentsTimestamps fails with N commentids", () => {
    it("should call N/timestampspagesize times", async () => {
      const error = new Error("ERROR");
      const count = 200;
      const commentids = Array(count)
        .fill("")
        .map((_, i) => i);
      fetchTimestampsSpy.mockRejectedValue(error);

      await store.dispatch(
        fetchAllCommentsTimestamps({ ...params, commentids })
      );

      expect(fetchTimestampsSpy).toBeCalledTimes(count / timestampspagesize);
      const state = store.getState();
      expect(state.commentsTimestamps.status).toEqual("failed");
      expect(state.commentsTimestamps.error).toEqual("ERROR");
    });
  });
});
