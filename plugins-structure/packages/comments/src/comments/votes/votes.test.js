import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, { fetchCommentsVotes, initialState } from "./votesSlice";

describe("Given the votesSlice", () => {
  let store;
  // spy on the fetch method
  let fetchCommentsVotesSpy;
  const params = { token: ["abcdefg"], userid: "my-user-id" };

  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({ reducer: { commentsVotes: reducer } });
    fetchCommentsVotesSpy = jest.spyOn(api, "fetchVotes");
  });
  afterEach(() => {
    fetchCommentsVotesSpy.mockRestore();
  });

  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  describe("when invalid params is passed to fetchVotes", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchCommentsVotes(invalidParams));
      expect(fetchCommentsVotesSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.commentsVotes.byUser).toEqual({});
      expect(state.commentsVotes.status).toEqual("idle");
    });
  });
  describe("when fetchVotes dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchCommentsVotes(params));

      expect(fetchCommentsVotesSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsVotes.byUser).toEqual({});
      expect(state.commentsVotes.status).toEqual("loading");
    });
  });
  describe("when fetchComments succeeds", () => {
    it("should update byUser and status", async () => {
      const vote = { commentid: 10, userid: "my-user-id" };
      const resValue = { votes: [{ commentid: 10, userid: "my-user-id" }] };
      fetchCommentsVotesSpy.mockResolvedValueOnce(resValue);

      await store.dispatch(fetchCommentsVotes(params));

      expect(fetchCommentsVotesSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsVotes.byUser).toEqual({
        "my-user-id": { abcdefg: { 10: vote } },
      });
      expect(state.commentsVotes.status).toEqual("succeeded");
    });
  });
  describe("when fetchComments fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchCommentsVotesSpy.mockRejectedValueOnce(error);

      await store.dispatch(fetchCommentsVotes(params));

      expect(fetchCommentsVotesSpy).toBeCalled();
      const state = store.getState();
      expect(state.commentsVotes.status).toEqual("failed");
      expect(state.commentsVotes.error).toEqual("ERROR");
    });
  });
});
