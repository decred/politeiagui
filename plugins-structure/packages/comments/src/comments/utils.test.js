import { getCommentsByParent, keyCommentsThreadsBy } from "./utils";
import { keyBy, random, range } from "lodash";

describe("Given getCommentsByParent util", () => {
  describe("when using a list with 3 comments", () => {
    it("should return the correct thread", () => {
      const comments = [
        { commentid: 1, parentid: 0 },
        { commentid: 2, parentid: 1 },
        { commentid: 3, parentid: 1 },
      ];
      let expectedThread = { 0: [1], 1: [2, 3] };
      const commentsByParent = getCommentsByParent(comments, false);
      expect(commentsByParent).toEqual(expectedThread);
      const flatThreadSchema = getCommentsByParent(comments, true);
      expectedThread = { 0: [1, 2, 3] };
      expect(flatThreadSchema).toEqual(expectedThread);
    });
  });
  describe("when usign a 6 comments list without any children", () => {
    it("should return the correct thread", () => {
      const comments = [
        { commentid: 1, parentid: 0 },
        { commentid: 2, parentid: 0 },
        { commentid: 3, parentid: 0 },
        { commentid: 4, parentid: 0 },
        { commentid: 5, parentid: 0 },
        { commentid: 6, parentid: 0 },
      ];
      let expectedThread = { 0: [1, 2, 3, 4, 5, 6] };
      const commentsByParent = getCommentsByParent(comments, false);
      expect(commentsByParent).toEqual(expectedThread);
      const flatThreadSchema = getCommentsByParent(comments, true);
      expectedThread = { 0: [1, 2, 3, 4, 5, 6] };
      expect(flatThreadSchema).toEqual(expectedThread);
    });
  });
  describe("when usign a 6 comments list where each comment is other's child", () => {
    it("should return the correct thread", () => {
      const comments = [
        { commentid: 1, parentid: 0 },
        { commentid: 2, parentid: 1 },
        { commentid: 3, parentid: 2 },
        { commentid: 4, parentid: 3 },
        { commentid: 5, parentid: 4 },
        { commentid: 6, parentid: 5 },
      ];
      let expectedThread = { 0: [1], 1: [2], 2: [3], 3: [4], 4: [5], 5: [6] };
      const commentsByParent = getCommentsByParent(comments, false);
      expect(commentsByParent).toEqual(expectedThread);
      const flatThreadSchema = getCommentsByParent(comments, true);
      expectedThread = { 0: [1, 2, 3, 4, 5, 6] };
      expect(flatThreadSchema).toEqual(expectedThread);
    });
  });
  describe("when getting a flat list using a random comments list of length 20", () => {
    it("should return all comments flattened", () => {
      const comments = Array(20)
        .fill({})
        .map((_, i) => ({ commentid: i + 1, parentid: random(0, i) }));
      const flatThreadSchema = getCommentsByParent(comments, true);
      const expectedThread = { 0: range(1, 21) };
      expect(flatThreadSchema).toEqual(expectedThread);
    });
  });
});

describe("Given keyCommentsThreadsBy util", () => {
  describe("when commentsById param is valid and iteratee is default", () => {
    it("should return comments thread by root parent commentid", () => {
      const commentsById = keyBy(
        [
          { commentid: 1, parentid: 0 },
          { commentid: 2, parentid: 1 },
          { commentid: 3, parentid: 0 },
          { commentid: 4, parentid: 0 },
          { commentid: 5, parentid: 4 },
          { commentid: 6, parentid: 0 },
        ],
        "commentid"
      );
      const commentsByRootParentId = keyCommentsThreadsBy(commentsById);
      expect(Object.keys(commentsByRootParentId)).toEqual(["1", "3", "4", "6"]);
    });
  });
  describe("when iteratee groups thread parents using custom iteratee", () => {
    it("should return comments by extradatahint", () => {
      const commentsById = keyBy(
        [
          { commentid: 1, parentid: 0 },
          { commentid: 2, parentid: 1 },
          { commentid: 3, parentid: 0 },
          { commentid: 4, parentid: 0, extradatahint: "hint" },
          { commentid: 5, parentid: 4 },
          { commentid: 6, parentid: 0, extradatahint: "hint" },
        ],
        "commentid"
      );
      const commentsByRootHint = keyCommentsThreadsBy(
        commentsById,
        (c) => c.extradatahint || "main"
      );
      expect(Object.keys(commentsByRootHint)).toEqual(["main", "hint"]);
    });
  });
  describe("when commentsById param is invalid", () => {
    it("should return an empty object for falsy values", () => {
      expect(keyCommentsThreadsBy()).toEqual({});
      expect(keyCommentsThreadsBy(false)).toEqual({});
      expect(keyCommentsThreadsBy(null)).toEqual({});
      expect(keyCommentsThreadsBy(undefined)).toEqual({});
    });
    it("should return an empty object when param is array", () => {
      expect(keyCommentsThreadsBy([])).toEqual({});
    });
    it("should return an empty object when param is an empty object", () => {
      expect(keyCommentsThreadsBy({})).toEqual({});
    });
  });
});
