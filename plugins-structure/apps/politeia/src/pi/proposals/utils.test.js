import { getPublicStatusChangeMetadata } from "./utils";

describe("given getPublicStatusChangeMetadata", () => {
  it("should get metadata when decoded payload is pure object", () => {
    const payloads = [
      {
        payload: {
          token: "65534868f4a07f06",
          version: 1,
          status: 2,
          timestamp: 1643305023,
        },
      },
      {
        payload: { userid: "uid" },
      },
    ];
    const publicMd = getPublicStatusChangeMetadata(payloads);
    expect(publicMd).toHaveProperty("status");
    expect(publicMd.status).toEqual(2);
    expect(publicMd.version).toEqual(1);
    expect(publicMd.token).toEqual("65534868f4a07f06");
  });
  it("should get metadata when decoded payload is an array", () => {
    const payloads = [
      {
        payload: { userid: "uid" },
      },
      {
        payload: [
          {
            token: "cca262561c5aef47",
            version: 1,
            status: 2,
            timestamp: 1643304956,
          },
          {
            token: "abandonedtoken",
            version: 1,
            status: 4,
            timestamp: 1643304958,
          },
          {
            token: "censoredtoken",
            version: 1,
            status: 3,
            timestamp: 1643304958,
          },
          {
            token: "testtoken",
            version: 1,
            status: "TEST",
            timestamp: 1643304958,
          },
        ],
      },
    ];
    const publicMd = getPublicStatusChangeMetadata(payloads);
    expect(publicMd).toHaveProperty("status");
    expect(publicMd.status).toEqual(2);
    expect(publicMd.version).toEqual(1);
    expect(publicMd.timestamp).toEqual(1643304956);
    expect(publicMd.token).toEqual("cca262561c5aef47");
  });
  it("should return an empty object when no valid payload is found", () => {
    const payloads = [
      {
        payload: { userid: "uid" },
      },
      {
        payload: [
          {
            token: "abandonedtoken",
            version: 1,
            status: 4,
            timestamp: 1643304958,
          },
          {
            token: "censoredtoken",
            version: 1,
            status: 3,
            timestamp: 1643304958,
          },
          {
            token: "testtoken",
            version: 1,
            status: "TEST",
            timestamp: 1643304958,
          },
        ],
      },
    ];
    const publicMd = getPublicStatusChangeMetadata(payloads);
    expect(publicMd).not.toHaveProperty("status");
    expect(publicMd.status).not.toBeDefined();
    expect(publicMd.version).not.toBeDefined();
    expect(publicMd.timestamp).not.toBeDefined();
    expect(publicMd.token).not.toBeDefined();
  });
  it("should return an empty object when payload is falsy", () => {
    const payloads = false;
    const publicMd = getPublicStatusChangeMetadata(payloads);
    expect(publicMd).not.toHaveProperty("status");
    expect(publicMd.status).not.toBeDefined();
    expect(publicMd.version).not.toBeDefined();
    expect(publicMd.timestamp).not.toBeDefined();
    expect(publicMd.token).not.toBeDefined();
  });
  it("should return an empty object when `payloads` is empty", () => {
    const payloads = [];
    const publicMd = getPublicStatusChangeMetadata(payloads);
    expect(publicMd).not.toHaveProperty("status");
    expect(publicMd.status).not.toBeDefined();
    expect(publicMd.version).not.toBeDefined();
    expect(publicMd.timestamp).not.toBeDefined();
    expect(publicMd.token).not.toBeDefined();
  });
});
