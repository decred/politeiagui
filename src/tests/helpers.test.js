import * as help from "../helpers";

const FILE = {
  name: "example.jpeg",
  mime: "image/jpeg",
  payload: "VGVzdCBwcm9wCiMgVGhpcyBpcyBhIHRlc3QgcHJvcG9zYWw="
};
const FILE_DIGESTED_PAYLOAD =
  "3973715772c4e0d41fc98fb67e97ad2436dca47961ac78a0757be43053d5af8c";

describe("test helpers functions", () => {
  test("test multiplyFloatingNumbers", () => {
    expect(help.multiplyFloatingNumbers(10, 0.1)).toEqual(1);
    expect(help.multiplyFloatingNumbers(10, 0.01)).toEqual(0.1);
    expect(help.multiplyFloatingNumbers(10, 0.001)).toEqual(0.01);
    expect(help.multiplyFloatingNumbers(0.1, 0.001)).toEqual(0.0001);
    expect(help.multiplyFloatingNumbers(0.01, 0.001)).toEqual(0.00001);
    expect(help.multiplyFloatingNumbers(2, 0.001)).toEqual(0.002);
    expect(help.multiplyFloatingNumbers(100.001, 0.01)).toEqual(1.00001);
    expect(help.multiplyFloatingNumbers(3, 0.1)).toEqual(0.3);
  });

  test("digests a payload", () => {
    const digested = help.digestPayload(FILE.payload);
    expect(digested).toEqual(FILE_DIGESTED_PAYLOAD);
  });

  test("it correctly returns the hex encoded SHA3-256 of a string", () => {
    expect(help.digest("password")).toEqual(
      "c0067d4af4e87f00dbac63b6156828237059172d1bbeac67427345d6a9fda484"
    );
  });
});

describe("test getTimeDiffInMinutes function", () => {
  test("it should return 0 when d2 == d1", () => {
    expect(help.getTimeDiffInMinutes(1591030381, 1591030381)).toEqual(0);
  });

  test("it should return positive when d1 > d2", () => {
    expect(
      help.getTimeDiffInMinutes(1591030521000, 1591030381000)
    ).toBeGreaterThan(0);
  });

  test("it should return negative when d1 < d2", () => {
    expect(
      help.getTimeDiffInMinutes(1591030381000, 1591030700000)
    ).toBeLessThan(0);
  });

  test("it should return correctly within the same hour", () => {
    expect(help.getTimeDiffInMinutes(1591030200000, 1591029900000)).toEqual(5);
  });

  test("it should return correctly when the hour overflows", () => {
    expect(help.getTimeDiffInMinutes(1591031100000, 1591030500000)).toEqual(10);
  });
});
