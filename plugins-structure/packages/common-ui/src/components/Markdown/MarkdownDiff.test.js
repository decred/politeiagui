import React from "react";
import { DiffHTML } from "./MarkdownDiff";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Given DiffHTML", () => {
  describe("when headers are different", () => {
    const newHeaders =
      "# Header 1\n## Header 2\n### Header 3\n##### common header\n\n";
    const oldHeaders =
      "# Header 1 ADD\n## Header 2\n#### Header 4\n##### common header\n\n";
    it("should return correct diff", () => {
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
  describe("when paragraphs are different", () => {
    const newParagraph = "Paragraph 1\n\nAnother P";
    const oldParagraph = "Paragraph 2\n\nAnother P";
    it("should return correct diff", () => {
      render(<DiffHTML oldText={oldParagraph} newText={newParagraph} />);
      const linesAdded = screen.getAllByTestId("md-line-added");
      const linesRemoved = screen.getAllByTestId("md-line-removed");
      expect(linesAdded).toHaveLength(1);
      expect(linesRemoved).toHaveLength(1);
      expect(screen.getAllByText("Another P")).toHaveLength(1);
    });
  });
  describe("when paragraphs are replaced by headers", () => {
    const paragraph = "My Text";
    const header = "# My Text";
    it("should return correct diff", () => {
      render(<DiffHTML oldText={paragraph} newText={header} />);
      const removedParagraph = screen.getByTestId("md-line-removed");
      const addedHeader = screen.getByTestId("md-line-added");
      // Removed element: <p>My Text</p>
      expect(removedParagraph).toHaveTextContent("My Text");
      expect(removedParagraph.firstChild.nodeName).toEqual("P");
      // Added element: <h1>My Text</h1>
      expect(addedHeader).toHaveTextContent("My Text");
      expect(addedHeader.firstChild.nodeName).toEqual("H1");
    });
  });
  describe("when texts are equal", () => {
    const text = "Sed porttitor lectus nibh.";
    it("should not return any diff", () => {
      render(<DiffHTML oldText={text} newText={text} />);
      expect(screen.queryAllByTestId("md-line-removed")).toHaveLength(0);
      expect(screen.queryAllByTestId("md-line-added")).toHaveLength(0);
      const textElement = screen.getByText(text);
      expect(textElement.nodeName).toEqual("P");
    });
  });
  describe("when old text is empty", () => {
    const text = "Sed porttitor lectus nibh.";
    it("should return all new text marked as added", () => {
      render(<DiffHTML oldText="" newText={text} />);
      expect(screen.queryAllByTestId("md-line-removed")).toHaveLength(0);
      expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
      const textElement = screen.getByText(text);
      expect(textElement.parentElement.className).toEqual("added");
    });
  });
  describe("when new text is empty", () => {
    const text = "Sed porttitor lectus nibh.";
    it("should return all new text marked as removed", () => {
      render(<DiffHTML oldText={text} newText="" />);
      expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
      expect(screen.queryAllByTestId("md-line-added")).toHaveLength(0);
      const textElement = screen.getByText(text);
      expect(textElement.parentElement.className).toEqual("removed");
    });
  });
  describe("when links are different", () => {
    describe("given different link labels", () => {
      const oldLink = "[my link](http://mylink.com)";
      const newLink = "[my new link](http://mylink.com)";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={oldLink} newText={newLink} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getByText("my link");
        expect(oldElement.getAttribute("href")).toEqual("http://mylink.com");
        expect(oldElement.parentNode.parentNode).toHaveClass("removed");
        const newElement = screen.getByText("my new link");
        expect(newElement.getAttribute("href")).toEqual("http://mylink.com");
        expect(newElement.parentNode.parentNode).toHaveClass("added");
      });
    });
    describe("given different link values", () => {
      const oldLink = "[my link](http://mylink.com)";
      const newLink = "[my link](http://mylinknew.com)";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={oldLink} newText={newLink} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getAllByText("my link")[0];
        expect(oldElement.getAttribute("href")).toEqual("http://mylink.com");
        expect(oldElement.parentNode.parentNode).toHaveClass("removed");
        const newElement = screen.getAllByText("my link")[1];
        expect(newElement.getAttribute("href")).toEqual("http://mylinknew.com");
        expect(newElement.parentNode.parentNode).toHaveClass("added");
      });
    });
    describe("given different html raw links", () => {
      const link = "<a href='javascript:void(0)'>my link</a>";
      it("should render html content as text, not as element", () => {
        render(<DiffHTML oldText={link} newText="" />);
        const removedLines = screen.getAllByTestId("md-line-removed");
        expect(removedLines).toHaveLength(1);
        const oldElement = screen.queryByText("my link");
        expect(oldElement.nodeName).toEqual("P");
        const rawLinkParagraph = removedLines[0].firstChild;
        expect(rawLinkParagraph.nodeName).toEqual("P");
        expect(rawLinkParagraph.firstChild.textContent).toEqual("my link");
        expect(rawLinkParagraph.firstChild.nodeName).toEqual("#text");
      });
    });
    describe("given equal html raw links", () => {
      const link = "<a href='javascript:void(0)'>my link</a>";
      it("should render html content as text, not as element", () => {
        render(<DiffHTML oldText={link} newText={link} />);
        const removedLines = screen.queryAllByTestId("md-line-removed");
        const addedLines = screen.queryAllByTestId("md-line-added");
        expect(removedLines).toHaveLength(0);
        expect(addedLines).toHaveLength(0);
        const renderedElement = screen.getByText("my link");
        expect(renderedElement.nodeName).toEqual("P");
        const element = screen.queryByText(link);
        expect(element).toBeFalsy();
      });
    });
  });
  describe("when using strong texts", () => {
    describe("given different strong texts", () => {
      const oldText = "**old**";
      const newText = "**new**";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={oldText} newText={newText} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getByText("old");
        const newElement = screen.getByText("new");
        expect(oldElement.nodeName).toEqual("STRONG");
        expect(oldElement.parentElement.parentElement).toHaveClass("removed");
        expect(newElement.nodeName).toEqual("STRONG");
        expect(newElement.parentElement.parentElement).toHaveClass("added");
      });
    });
    describe("given same text, but one strong and other regular", () => {
      const oldText = "**old**";
      const newText = "old";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={oldText} newText={newText} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getAllByText("old")[0];
        const newElement = screen.getAllByText("old")[1];
        expect(oldElement.nodeName).toEqual("STRONG");
        expect(oldElement.parentElement.parentElement).toHaveClass("removed");
        expect(newElement.nodeName).toEqual("P");
        expect(newElement.parentElement).toHaveClass("added");
      });
    });
  });
});
