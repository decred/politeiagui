import * as help from "../helpers";
import { INVALID_DATE_LABEL } from "../constants";

const FILE = {
  name: "example.jpeg",
  mime: "image/jpeg",
  payload: "VGVzdCBwcm9wCiMgVGhpcyBpcyBhIHRlc3QgcHJvcG9zYWw="
};

const MD_FILE = {
  mime: "text/plain; charset=utf-8",
  name: "index.md",
  payload: "cHJvcG9zYWwgZGVzY3JpcHRpb24="
};

const PROPOSAL_TEXT = "proposal description";

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

  test("it should return the proposal description from a md file", () => {
    expect(help.getTextFromIndexMd(MD_FILE)).toEqual("proposal description");
    expect(help.getTextFromIndexMd()).toEqual("");
  });

  test("it correctly encodes text into md files", () => {
    expect(help.getIndexMdFromText(PROPOSAL_TEXT)).toEqual(MD_FILE);
    expect(help.getIndexMdFromText()).toEqual({ ...MD_FILE, payload: "" });
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

describe("test getInternationalDateString function", () => {
  test("it should return correctly with valid date input", () => {
    expect(
      help.formatDateToInternationalString({ day: 5, month: 1, year: 2019 })
    ).toEqual("05 Jan 2019");
    expect(
      help.formatDateToInternationalString({ day: 12, month: 2, year: 2021 })
    ).toEqual("12 Feb 2021");
    expect(
      help.formatDateToInternationalString({ day: 6, month: 3, year: 2019 })
    ).toEqual("06 Mar 2019");
    expect(
      help.formatDateToInternationalString({ day: 21, month: 4, year: 2021 })
    ).toEqual("21 Apr 2021");
    expect(
      help.formatDateToInternationalString({ day: 21, month: 5, year: 2019 })
    ).toEqual("21 May 2019");
    expect(
      help.formatDateToInternationalString({ day: 30, month: 6, year: 2021 })
    ).toEqual("30 Jun 2021");
    expect(
      help.formatDateToInternationalString({ day: 15, month: 7, year: 2019 })
    ).toEqual("15 Jul 2019");
    expect(
      help.formatDateToInternationalString({ day: 26, month: 8, year: 2021 })
    ).toEqual("26 Aug 2021");
    expect(
      help.formatDateToInternationalString({ day: 15, month: 9, year: 2019 })
    ).toEqual("15 Sep 2019");
    expect(
      help.formatDateToInternationalString({ day: 9, month: 10, year: 2021 })
    ).toEqual("09 Oct 2021");
    expect(
      help.formatDateToInternationalString({ day: 25, month: 11, year: 2019 })
    ).toEqual("25 Nov 2019");
    expect(
      help.formatDateToInternationalString({ day: 30, month: 12, year: 2021 })
    ).toEqual("30 Dec 2021");
  });

  test("it should return error with invalid date input", () => {
    expect(
      help.formatDateToInternationalString({ day: 0, month: 1, year: 2019 })
    ).toEqual(INVALID_DATE_LABEL);
    expect(
      help.formatDateToInternationalString({ day: 10, month: 0, year: 2019 })
    ).toEqual(INVALID_DATE_LABEL);
    expect(
      help.formatDateToInternationalString({ day: 10, month: 13, year: 2019 })
    ).toEqual(INVALID_DATE_LABEL);
    expect(
      help.formatDateToInternationalString({ day: null, month: 10, year: 2019 })
    ).toEqual(INVALID_DATE_LABEL);
    expect(
      help.formatDateToInternationalString({ day: undefined, month: 10, year: 2019 })
    ).toEqual(INVALID_DATE_LABEL);
    expect(
      help.formatDateToInternationalString({ day: 8, month: null, year: 2019 })
    ).toEqual(INVALID_DATE_LABEL);
    expect(
      help.formatDateToInternationalString({ day: 8, month: 10, year: null })
    ).toEqual(INVALID_DATE_LABEL);
  });
});
