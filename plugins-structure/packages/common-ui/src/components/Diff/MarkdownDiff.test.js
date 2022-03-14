import React from "react";
import { DiffHTML } from "./MarkdownDiff";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Given DiffHTML method", () => {
  describe("when headers are different", () => {
    const newHeaders =
      "# Header 1\n## Header 2\n### Header 3\n##### common header\n\n";
    const oldHeaders =
      "# Header 1 ADD\n## Header 2\n#### Header 4\n##### common header\n\n";

    it("should return correct diff lines length", () => {
      render(<DiffHTML oldText={oldHeaders} newText={newHeaders} />);
      const h2 = screen.getAllByText("Header 2");
      expect(h2).toHaveLength(1);
      const h1 = screen.getAllByText("Header 1");
      const h1Add = screen.getAllByText("Header 1 ADD");
      expect(h1).toHaveLength(1);
      expect(h1Add).toHaveLength(1);
      const commonHeader = screen.getAllByText("common header");
      expect(commonHeader).toHaveLength(1);

      expect(screen.getAllByTestId("md-line-added")).toHaveLength(2);
      expect(screen.getAllByTestId("md-line-removed")).toHaveLength(2);
    });
  });
  describe("when paragraps are different", () => {
    const newParagraph = "Paragraph 1\n\nAnother P";
    const oldParagraph = "Paragraph 2\n\nAnother P";

    it("should return correct diff lines length", () => {
      render(<DiffHTML oldText={oldParagraph} newText={newParagraph} />);
      const linesAdded = screen.getAllByTestId("md-line-added");
      const linesRemoved = screen.getAllByTestId("md-line-removed");
      expect(linesAdded).toHaveLength(1);
      expect(linesRemoved).toHaveLength(1);
      expect(screen.getAllByText("Another P")).toHaveLength(1);
    });
  });
});
