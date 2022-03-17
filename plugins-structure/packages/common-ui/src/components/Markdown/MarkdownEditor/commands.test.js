import { getLineContent, getSelectedContent } from "./commands";

const multiLineText = `Vestibulum ac diam sit amet quam vehicula.

Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.

Pellentesque in ipsum id orci porta dapibus.`;

describe("Given getLineContent util", () => {
  describe("when cursor is at the beginning of the multiLineText", () => {
    it("should select the first line", () => {
      const { previous, current, next } = getLineContent(multiLineText, 0);
      expect(current).toEqual("Vestibulum ac diam sit amet quam vehicula.");
      expect(previous).toEqual("");
      expect(next).toEqual(
        "\nCurabitur arcu erat, accumsan id imperdiet et, porttitor at sem.\n\nPellentesque in ipsum id orci porta dapibus."
      );
    });
  });
  describe("when cursor is at the end of the multiLineText", () => {
    it("should select a new empty line", () => {
      const { previous, current, next } = getLineContent(
        multiLineText,
        multiLineText.length
      );
      expect(current).toEqual("");
      expect(previous).toEqual(multiLineText);
      expect(next).toEqual("");
    });
  });
  describe("when cursor is at a random position on first line", () => {
    it("should select the first line", () => {
      const { previous, current, next } = getLineContent(multiLineText, 20);
      expect(current).toEqual("Vestibulum ac diam sit amet quam vehicula.");
      expect(previous).toEqual("");
      expect(next).toEqual(
        "\nCurabitur arcu erat, accumsan id imperdiet et, porttitor at sem.\n\nPellentesque in ipsum id orci porta dapibus."
      );
    });
  });
  describe("when cursor is at a random position on second line", () => {
    it("should select the second line", () => {
      const { previous, current, next } = getLineContent(multiLineText, 50);
      expect(current).toEqual(
        "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem."
      );
      expect(previous).toEqual("Vestibulum ac diam sit amet quam vehicula.\n");
      expect(next).toEqual("\nPellentesque in ipsum id orci porta dapibus.");
    });
  });
  describe("when cursor is at a random position on third line", () => {
    it("should select the third line", () => {
      const { previous, current, next } = getLineContent(multiLineText, 120);
      expect(current).toEqual("Pellentesque in ipsum id orci porta dapibus.");
      expect(previous).toEqual(
        "Vestibulum ac diam sit amet quam vehicula.\n\nCurabitur arcu erat, accumsan id imperdiet et, porttitor at sem.\n"
      );
      expect(next).toEqual("");
    });
  });
});

const text = "First second third\n\nnew line";
describe("Given getSelectedContent util", () => {
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
