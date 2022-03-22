import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, {
  fetchCommentsTimestamps,
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
      reducer: { commentsTimestamps: reducer, commentsPolicy: policyReducer },
      preloadedState: {
        commentsPolicy: {
          policy: { timestampspagesize: 10 },
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
      expect(state.commentsTimestamps.byToken).toEqual({});
      expect(state.commentsTimestamps.status).toEqual("idle");
    });
  });
  describe("when fetchCommentsTimestamps dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchCommentsTimestamps(params));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsTimestamps.byToken).toEqual({});
      expect(state.commentsTimestamps.status).toEqual("loading");
    });
  });
  describe("when fetchCommentsTimestamps succeeds with a complete page", () => {
    it("should update byToken and status", async () => {
      const resValue = { comments: {} };
      fetchTimestampsSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchCommentsTimestamps(params));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsTimestamps.byToken).toEqual({
        fakeToken: {},
      });
      expect(state.commentsTimestamps.status).toEqual("succeeded/isDone");
    });
  });
  describe("when fetchCommentsTimestamps succeeds with an incomplete page", () => {
    it("should update byToken and status", async () => {
      const incompletePage = Array(100)
        .fill("")
        .reduce((acc, _, i) => ({ ...acc, [i]: {} }), {});
      const resValue = { comments: incompletePage };
      fetchTimestampsSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchCommentsTimestamps(params));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsTimestamps.byToken).toEqual({
        fakeToken: incompletePage,
      });
      expect(state.commentsTimestamps.status).toEqual("succeeded/hasMore");
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
});
