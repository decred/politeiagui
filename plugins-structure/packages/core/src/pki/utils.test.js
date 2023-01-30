import { toHex } from "./utils";

describe("Given toHex util", () => {
  it("should return a hex string", () => {
    const hex = toHex("hello");
    expect(hex).toEqual("68656c6c6f");
  });
  it("should throw when passing invalid params", () => {
    const params = [null, undefined, 123];
    for (const param of params) {
      expect(() => toHex(param)).toThrow();
    }
  });
  it("should accept other valid params", () => {
    // [104, 101, 108, 108, 111] stands for "hello"
    const hex = toHex([104, 101, 108, 108, 111]);
    const helloHex = toHex("hello");
    expect(hex).toEqual("68656c6c6f");
    expect(hex).toEqual(helloHex);
  });
});
