import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, { fetchCommentsCount, initialState } from "./countSlice";
import policyReducer from "../policy/policySlice";

describe("Given the countSlice", () => {
  let store;
  // spy on the fetch method
  let fetchCommentsCountSpy;
  const params = { tokens: ["abcdefg"] };

  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({
      reducer: { commentsCount: reducer, commentsPolicy: policyReducer },
      preloadedState: {
        commentsPolicy: {
          policy: { countpagesize: 10 },
        },
      },
    });
    fetchCommentsCountSpy = jest.spyOn(api, "fetchCount");
  });
  afterEach(() => {
    fetchCommentsCountSpy.mockRestore();
  });

  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  describe("when invalid token is passed to fetchCount", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchCommentsCount(invalidParams));
      expect(fetchCommentsCountSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.commentsCount.byToken).toEqual({});
      expect(state.commentsCount.status).toEqual("idle");
    });
  });
  describe("when fetchCount dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchCommentsCount(params));

      expect(fetchCommentsCountSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsCount.byToken).toEqual({});
      expect(state.commentsCount.status).toEqual("loading");
    });
  });
  describe("when fetchComments succeeds", () => {
    it("should update byToken and status", async () => {
      const resValue = { abcdefg: 10 };
      fetchCommentsCountSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchCommentsCount(params));

      expect(fetchCommentsCountSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsCount.byToken).toEqual({
        abcdefg: 10,
      });
      expect(state.commentsCount.status).toEqual("succeeded");
    });
  });
  describe("when fetchComments fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchCommentsCountSpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchCommentsCount(params));

      expect(fetchCommentsCountSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsCount.status).toEqual("failed");
      expect(state.commentsCount.error).toEqual("ERROR");
    });
  });
});
