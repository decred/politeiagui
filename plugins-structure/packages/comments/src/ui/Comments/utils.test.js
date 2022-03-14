import { getThreadSchema } from "./utils";
import { random, range } from "lodash";

describe("Given getThreadSchema util", () => {
  describe("when using a list with 3 comments", () => {
    it("should return the correct thread", () => {
      const comments = [
        { commentid: 1, parentid: 0 },
        { commentid: 2, parentid: 1 },
        { commentid: 3, parentid: 1 },
      ];
      let expectedThread = { 0: [1], 1: [2, 3] };
      const threadSchema = getThreadSchema(comments, false);
      expect(threadSchema).toEqual(expectedThread);
      const flatThreadSchema = getThreadSchema(comments, true);
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
      const threadSchema = getThreadSchema(comments, false);
      expect(threadSchema).toEqual(expectedThread);
      const flatThreadSchema = getThreadSchema(comments, true);
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
      const threadSchema = getThreadSchema(comments, false);
      expect(threadSchema).toEqual(expectedThread);
      const flatThreadSchema = getThreadSchema(comments, true);
      expectedThread = { 0: [1, 2, 3, 4, 5, 6] };
      expect(flatThreadSchema).toEqual(expectedThread);
    });
  });
  describe("when getting a flat list using a random comments list of length 20", () => {
    it("should return all comments flattened", () => {
      const comments = Array(20)
        .fill({})
        .map((_, i) => ({ commentid: i + 1, parentid: random(0, i) }));
      const flatThreadSchema = getThreadSchema(comments, true);
      const expectedThread = { 0: range(1, 21) };
      expect(flatThreadSchema).toEqual(expectedThread);
    });
  });
});
