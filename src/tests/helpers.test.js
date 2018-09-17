import { multiplyFloatingNumbers } from "../helpers";

describe("test helpers functions", () => {
  test("test multiplyFloatingNumbers", () => {
    expect(multiplyFloatingNumbers(10, 0.1)).toEqual(1);
    expect(multiplyFloatingNumbers(10, 0.01)).toEqual(0.1);
    expect(multiplyFloatingNumbers(10, 0.001)).toEqual(0.01);
    expect(multiplyFloatingNumbers(0.1, 0.001)).toEqual(0.0001);
    expect(multiplyFloatingNumbers(0.01, 0.001)).toEqual(0.00001);
    expect(multiplyFloatingNumbers(2, 0.001)).toEqual(0.002);
    expect(multiplyFloatingNumbers(100.001, 0.01)).toEqual(1.00001);
    expect(multiplyFloatingNumbers(3, 0.1)).toEqual(0.3);
  });
});
