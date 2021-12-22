import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, { fetchComments, initialState } from "./commentsSlice";

describe("Given the commentsSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchCommentsSpy;
  const params = {
    token: "fakeToken",
  };
  const commentid = 1;
  const validComment = {
    userid: "fake-user-uuid",
    username: "fakeUser",
    state: 2,
    token: "fakeToken",
    parentid: 0,
    comment: "comment 1",
    commentid,
    timestamp: 10000,
    downvotes: 0,
    upvotes: 0,
  };

  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { comments: reducer } });
    fetchCommentsSpy = jest.spyOn(api, "fetchComments");
  });
  afterEach(() => {
    fetchCommentsSpy.mockRestore();
  });

  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  describe("when invalid token is passed to fetchComments", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchComments(invalidParams));
      expect(fetchCommentsSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.comments.byToken).toEqual({});
      expect(state.comments.status).toEqual("idle");
    });
  });
  describe("when fetchComments dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchComments(params));

      expect(fetchCommentsSpy).toBeCalled();
      const state = store.getState();
      expect(state.comments.byToken).toEqual({});
      expect(state.comments.status).toEqual("loading");
    });
  });
  describe("when fetchComments succeeds", () => {
    it("should update byToken and status", async () => {
      const resValue = {
        comments: [validComment],
      };
      fetchCommentsSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchComments(params));

      expect(fetchCommentsSpy).toBeCalled();
      const state = store.getState();
      expect(state.comments.byToken).toEqual({
        fakeToken: { [commentid]: validComment },
      });
      expect(state.comments.status).toEqual("succeeded");
    });
  });
  describe("when fetchComments fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchCommentsSpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchComments(params));

      expect(fetchCommentsSpy).toBeCalled();
      const state = store.getState();
      expect(state.comments.status).toEqual("failed");
      expect(state.comments.error).toEqual("ERROR");
    });
  });
});
