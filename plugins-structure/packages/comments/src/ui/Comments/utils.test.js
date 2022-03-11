import { getThreadSchema } from "./utils";

describe("Given getThreadSchema util", () => {
  it("should return correct thread", () => {
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
