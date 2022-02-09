import {
  getHumanReadableRecordStatus,
  getRecordStatusCode,
  getHumanReadableRecordState,
  getRecordStateCode,
  validRecordStatuses,
  validRecordStates,
  skipTokensAlreadyLoaded,
} from "./utils";

const invalidStates = [3, -1, 0, "some_string"];
const invalidStatus = [5, -1, 0, "some_string"];

describe("Given utils", () => {
  describe("Given getHumanReadableRecordStatus", () => {
    it("should throw when invalid status", () => {
      for (const item of invalidStatus) {
        expect(() => getHumanReadableRecordStatus(item)).toThrowWithMessage(
          TypeError,
          `Invalid status. You are trying to get the status code of an invalid status. Valid ones are: ${validRecordStatuses}`
        );
      }
    });
    it("should return the string equivalent of a status", () => {
      expect(getHumanReadableRecordStatus(1)).toBe("unreviewed");
      expect(getHumanReadableRecordStatus("1")).toBe("unreviewed");
      expect(getHumanReadableRecordStatus("unreviewed")).toBe("unreviewed");
      expect(getHumanReadableRecordStatus(2)).toBe("public");
      expect(getHumanReadableRecordStatus("2")).toBe("public");
      expect(getHumanReadableRecordStatus("public")).toBe("public");
      expect(getHumanReadableRecordStatus(3)).toBe("censored");
      expect(getHumanReadableRecordStatus("3")).toBe("censored");
      expect(getHumanReadableRecordStatus("censored")).toBe("censored");
      expect(getHumanReadableRecordStatus(4)).toBe("archived");
      expect(getHumanReadableRecordStatus("4")).toBe("archived");
      expect(getHumanReadableRecordStatus("archived")).toBe("archived");
    });
  });
  describe("Given getRecordStatusCode", () => {
    it("should throw when invalid status", () => {
      for (const item of invalidStatus) {
        expect(() => getRecordStatusCode(item)).toThrowWithMessage(
          TypeError,
          `Invalid status. You are trying to get the status code of an invalid status. Valid ones are: ${validRecordStatuses}`
        );
      }
    });
    it("should return the code equivalent of a status", () => {
      expect(getRecordStatusCode(1)).toBe(1);
      expect(getRecordStatusCode("1")).toBe(1);
      expect(getRecordStatusCode("unreviewed")).toBe(1);
      expect(getRecordStatusCode(2)).toBe(2);
      expect(getRecordStatusCode("2")).toBe(2);
      expect(getRecordStatusCode("public")).toBe(2);
      expect(getRecordStatusCode(3)).toBe(3);
      expect(getRecordStatusCode("3")).toBe(3);
      expect(getRecordStatusCode("censored")).toBe(3);
      expect(getRecordStatusCode(4)).toBe(4);
      expect(getRecordStatusCode("4")).toBe(4);
      expect(getRecordStatusCode("archived")).toBe(4);
    });
  });
  describe("Given getHumanReadableRecordState", () => {
    it("should throw when invalid state", () => {
      for (const item of invalidStates) {
        expect(() => getHumanReadableRecordState(item)).toThrowWithMessage(
          TypeError,
          `Invalid state. You are trying to get the state code of an invalid state. Valid ones are: ${validRecordStates}`
        );
      }
    });
    it("should return the string equivalent of a state", () => {
      expect(getHumanReadableRecordState(1)).toBe("unvetted");
      expect(getHumanReadableRecordState("1")).toBe("unvetted");
      expect(getHumanReadableRecordState("unvetted")).toBe("unvetted");
      expect(getHumanReadableRecordState(2)).toBe("vetted");
      expect(getHumanReadableRecordState("2")).toBe("vetted");
      expect(getHumanReadableRecordState("vetted")).toBe("vetted");
    });
  });
  describe("Given getRecordStateCode", () => {
    it("should throw when invalid state", () => {
      for (const item of invalidStates) {
        expect(() => getRecordStateCode(item)).toThrowWithMessage(
          TypeError,
          `Invalid state. You are trying to get the state code of an invalid state. Valid ones are: ${validRecordStates}`
        );
      }
    });
    it("should return the code equivalent of a state", () => {
      expect(getRecordStateCode(1)).toBe(1);
      expect(getRecordStateCode("1")).toBe(1);
      expect(getRecordStateCode("unvetted")).toBe(1);
      expect(getRecordStateCode(2)).toBe(2);
      expect(getRecordStateCode("2")).toBe(2);
      expect(getRecordStateCode("vetted")).toBe(2);
    });
  });

  describe("Given the skipTokensAlreadyLoaded helper", () => {
    it("should return tokens and lastTokenPos when there's no loaded records", () => {
      const tokensToFetch = [1, 2, 3, 4, 5];
      const lastTokenPos = 4;
      const records = {};
      const inventoryListList = [1, 2, 3, 4, 5];
      const { tokens, last } = skipTokensAlreadyLoaded({
        tokens: tokensToFetch,
        records,
        lastTokenPos,
        inventoryListList,
      });
      expect(tokens).toEqual(tokensToFetch);
      expect(last).toEqual(lastTokenPos);
    });
    it("should return corectly when there are loaded records and no more inventoryList", () => {
      const tokensToFetch = [1, 2, 3, 4, 5];
      const lastTokenPos = 4;
      const records = {
        2: true,
        4: true,
      };
      const inventoryList = [1, 2, 3, 4, 5];
      const { tokens, last } = skipTokensAlreadyLoaded({
        tokens: tokensToFetch,
        records,
        lastTokenPos,
        inventoryList,
      });
      expect(tokens).toEqual([1, 3, 5]);
      expect(last).toEqual(4);
    });
    it("should return corectly when there are loaded records and still not visited inventoryList tokens", () => {
      const tokensToFetch = [1, 2, 3, 4, 5];
      const lastTokenPos = 4;
      const records = {
        2: true,
        4: true,
      };
      const inventoryList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const { tokens, last } = skipTokensAlreadyLoaded({
        tokens: tokensToFetch,
        records,
        lastTokenPos,
        inventoryList,
      });
      expect(tokens).toEqual([1, 3, 5, 6, 7]);
      expect(last).toEqual(6);
    });
    it("should return corectly when there are loaded records, still not visited inventoryList tokens and some of these tokens are visited", () => {
      const tokensToFetch = [1, 2, 3, 4, 5];
      const lastTokenPos = 4;
      const records = {
        2: true,
        4: true,
        7: true,
      };
      const inventoryList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const { tokens, last } = skipTokensAlreadyLoaded({
        tokens: tokensToFetch,
        records,
        lastTokenPos,
        inventoryList,
      });
      expect(tokens).toEqual([1, 3, 5, 6, 8]);
      expect(last).toEqual(7);
    });
  });
});
