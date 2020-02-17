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
