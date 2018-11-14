import * as fp from "../fp";

describe("test functional programming lib (lib/fp.js)", () => {
  const random = a => a;
  const truthyFunc = () => true;
  const falsyFunc = () => false;
  const notFunc = a => !a;
  test("arg", () => {
    const result = fp.arg(2)("a", "b", "c");
    expect(result).toEqual("c");
  });
  test("constant", () => {
    const result = fp.constant("a")();
    expect(result).toEqual("a");
  });
  test("not", () => {
    const equal = (a, b) => a === b;
    const result = fp.not(equal)(2, 2);
    expect(result).toEqual(false);
  });
  test("bool", () => {
    const random = a => a;
    const result = fp.bool(random)(4);
    expect(typeof result).toEqual("boolean");
    expect(result).toBeTruthy();
  });
  test("or", () => {
    let result = fp.or(notFunc, random, truthyFunc)(14);
    expect(result).toEqual(14);
    result = fp.or(notFunc, falsyFunc)(14);
    expect(result).toEqual(false);
  });
  test("and", () => {
    let result = fp.and(truthyFunc, random)(14);
    expect(result).toEqual(14);
    result = fp.and(falsyFunc, random)(14);
    expect(result).toEqual(false);
  });
});
