import { validateRecordState, validateRecordStatus } from "./validation";
import { validRecordStatuses, validRecordStates } from "./utils";

const invalidStates = [3, -1, 0, "some_string"];
const invalidStatus = [5, -1, 0, "some_string"];

describe("State and Status validation", () => {
  let consoleErrorMock;
  beforeAll(() => {
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation();
  });
  afterAll(() => {
    consoleErrorMock.mockRestore();
  });
  describe("Given validateRecordState", () => {
    it("should throw if is required and no argument is provided", () => {
      expect(() => validateRecordState(undefined, true)).toThrowWithMessage(
        TypeError,
        "recordsState is required"
      );
      expect(consoleErrorMock).toBeCalledWith(
        TypeError("recordsState is required")
      );
    });
    it("should not throw required error if is not required and no argument is provided. Throws invalid error", () => {
      expect(() =>
        validateRecordState(undefined, false)
      ).not.toThrowWithMessage(TypeError, "recordsState is required");
      expect(() => validateRecordState(undefined, false)).toThrowWithMessage(
        TypeError,
        `State 'undefined' invalid. Valid states are: ${validRecordStates}`
      );
      expect(consoleErrorMock).toBeCalledWith(
        TypeError(
          `State 'undefined' invalid. Valid states are: ${validRecordStates}`
        )
      );
    });
    it("should throw and console error if invalid state is passed", () => {
      for (const item of invalidStates) {
        expect(() => validateRecordState(item)).toThrowWithMessage(
          TypeError,
          `State '${item}' invalid. Valid states are: ${validRecordStates}`
        );
        expect(consoleErrorMock).toBeCalledWith(
          TypeError(
            `State '${item}' invalid. Valid states are: ${validRecordStates}`
          )
        );
      }
    });
    it("should return true if states are valid", () => {
      expect(validateRecordState("vetted")).toBeTruthy();
      expect(validateRecordState("unvetted")).toBeTruthy();
      expect(validateRecordState(1)).toBeTruthy();
      expect(validateRecordState(2)).toBeTruthy();
      expect(validateRecordState("1")).toBeTruthy();
      expect(validateRecordState("2")).toBeTruthy();
    });
  });

  describe("Given validateRecordStatus", () => {
    it("should throw if is required and no argument is provided", () => {
      expect(() => validateRecordStatus(undefined, true)).toThrowWithMessage(
        TypeError,
        "status is required"
      );
      expect(consoleErrorMock).toBeCalledWith(TypeError("status is required"));
    });
    it("should not throw required error if is not required and no argument is provided. Throws invalid error", () => {
      expect(() =>
        validateRecordStatus(undefined, false)
      ).not.toThrowWithMessage(TypeError, "status is required");
      expect(() => validateRecordStatus(undefined, false)).toThrowWithMessage(
        TypeError,
        `Status 'undefined' invalid. Valid statuses are: ${validRecordStatuses}`
      );
      expect(consoleErrorMock).toBeCalledWith(
        TypeError(
          `Status 'undefined' invalid. Valid statuses are: ${validRecordStatuses}`
        )
      );
    });
    it("should throw and console error if invalid state is passed", () => {
      for (const item of invalidStatus) {
        expect(() => validateRecordStatus(item)).toThrowWithMessage(
          TypeError,
          `Status '${item}' invalid. Valid statuses are: ${validRecordStatuses}`
        );
        expect(consoleErrorMock).toBeCalledWith(
          TypeError(
            `Status '${item}' invalid. Valid statuses are: ${validRecordStatuses}`
          )
        );
      }
    });
    it("should return true if statuses are valid", () => {
      expect(validateRecordStatus("unreviewed")).toBeTruthy();
      expect(validateRecordStatus("public")).toBeTruthy();
      expect(validateRecordStatus("censored")).toBeTruthy();
      expect(validateRecordStatus("archived")).toBeTruthy();
      expect(validateRecordStatus(1)).toBeTruthy();
      expect(validateRecordStatus(2)).toBeTruthy();
      expect(validateRecordStatus(3)).toBeTruthy();
      expect(validateRecordStatus(4)).toBeTruthy();
      expect(validateRecordStatus("1")).toBeTruthy();
      expect(validateRecordStatus("2")).toBeTruthy();
      expect(validateRecordStatus("3")).toBeTruthy();
      expect(validateRecordStatus("4")).toBeTruthy();
    });
  });
});