import { parseResponse } from "./client";

function MockResponse({ status, statusText, data }) {
  return {
    status,
    statusText,
    json: () => data,
  };
}

describe("Given parseResponse util", () => {
  describe("when response succeeds", () => {
    it("should return the json", async () => {
      const res = await parseResponse(
        MockResponse({ status: 200, data: "result" })
      );
      expect(res).toEqual("result");
    });
  });
  describe("when response fails", () => {
    const response = MockResponse({
      status: 400,
      statusText: "Bad Request",
      data: { errorcode: 20 },
    });

    it("should throw error", async () => {
      await expect(async () => await parseResponse(response)).rejects.toThrow();
    });
    it("should include response data into error body", async () => {
      let error;
      try {
        await parseResponse(response);
      } catch (e) {
        error = e;
      }
      expect(error.body).toEqual({ errorcode: 20 });
      expect(error.message).toEqual("Bad Request");
    });
  });
});
