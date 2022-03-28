import { getMultiLineContent, getSelectedContent } from "./utils";

describe("Given getMultiLineContent util", () => {
  const line1 = "Cras ultricies ligula sed magna dictum porta.";
  const line2 = "Nulla porttitor accumsan tincidunt.";
  const line3 = "Cras ultricies ligula sed magna dictum porta.";
  const multiLineText = `${line1}\n${line2}\n${line3}`;

  describe("when selecting the first line", () => {
    it("should return the seleted line", () => {
      const { previous, current, next } = getMultiLineContent(
        multiLineText,
        0,
        1
      );
      expect(previous).toEqual("");
      expect(current).toEqual([line1]);
      expect(next).toEqual(`${line2}\n${line3}`);
    });
  });
  describe("when selecting the second line", () => {
    it("should return the seleted line", () => {
      const { previous, current, next } = getMultiLineContent(
        multiLineText,
        50,
        51
      );
      expect(previous).toEqual(`${line1}`);
      expect(current).toEqual([line2]);
      expect(next).toEqual(`${line3}`);
    });
  });
  describe("when selecting the third line", () => {
    it("should return the seleted line", () => {
      const { previous, current, next } = getMultiLineContent(
        multiLineText,
        100,
        101
      );
      expect(previous).toEqual(`${line1}\n${line2}`);
      expect(current).toEqual([line3]);
      expect(next).toEqual("");
    });
  });
});

describe("Given getSelectedContent util", () => {
  const text = "First second third\n\nnew line";
  describe("when first word is selected", () => {
    it("should return the selected word", () => {
      const { previous, current, next } = getSelectedContent(text, 0, 5);
      expect(current).toEqual("First");
      expect(previous).toEqual("");
      expect(next).toEqual(" second third\n\nnew line");
    });
  });
  describe("when cursor has the same start and end positions", () => {
    it("should return an empty word", () => {
      const { previous, current, next } = getSelectedContent(text, 5, 5);
      expect(current).toEqual("");
      expect(previous).toEqual("First");
      expect(next).toEqual(" second third\n\nnew line");
    });
  });
  describe("when whole text is selected", () => {
    it("should return the whole text with empty previous and next terms", () => {
      const { previous, current, next } = getSelectedContent(
        text,
        0,
        text.length
      );
      expect(current).toEqual(text);
      expect(previous).toEqual("");
      expect(next).toEqual("");
    });
  });
});
