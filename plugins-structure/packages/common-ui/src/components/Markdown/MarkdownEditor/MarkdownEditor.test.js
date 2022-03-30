import React from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
jest.mock(
  "pi-ui",
  () => ({
    ButtonIcon: () => <div>Button</div>,
    classNames: (...args) => args.map((a) => a || "").join(" "),
  }),
  { virtual: true }
);

describe("Given MarkdownEditor", () => {
  let element;
  beforeEach(() => {
    render(<MarkdownEditor onChange={() => {}} />);
    element = screen.getByTestId("markdown-editor");
    fireEvent.focus(element);
  });
  afterEach(() => {
    cleanup();
    element = null;
  });
  describe("when typing", () => {
    it("should update editor text", () => {
      fireEvent.change(element, { target: { value: "abc" } });
      const newElement = screen.getByTestId("markdown-editor");
      expect(newElement).toHaveTextContent("abc");
    });
  });
  describe("when dispatching commands", () => {
    describe("undo command should restore editor state to previous state", () => {
      it("cmd+z", () => {
        fireEvent.change(element, { target: { value: "abc" } });
        fireEvent.keyDown(element, { key: "z", keyCode: 122, metaKey: true });
        const newElement = screen.getByTestId("markdown-editor");
        expect(newElement.value).toEqual("");
      });
      it("ctrl+z", () => {
        fireEvent.change(element, { target: { value: "abc" } });
        fireEvent.keyDown(element, { key: "z", keyCode: 122, ctrlKey: true });
        const newElement = screen.getByTestId("markdown-editor");
        expect(newElement.value).toEqual("");
      });
    });
    describe("redo command should restore undo changes", () => {
      it("cmd+shift+z", () => {
        fireEvent.change(element, { target: { value: "abc" } });
        // Undo
        fireEvent.keyDown(element, {
          key: "z",
          keyCode: 122,
          metaKey: true,
        });
        let newElement = screen.getByTestId("markdown-editor");
        expect(newElement.value).toEqual("");
        // redo
        fireEvent.keyDown(element, {
          key: "z",
          keyCode: 122,
          metaKey: true,
          shiftKey: true,
        });
        newElement = screen.getByTestId("markdown-editor");
        expect(newElement.value).toEqual("abc");
      });
      it("ctrl+shift+z", () => {
        fireEvent.change(element, { target: { value: "abc" } });
        // Undo
        fireEvent.keyDown(element, {
          key: "z",
          keyCode: 122,
          ctrlKey: true,
        });
        let newElement = screen.getByTestId("markdown-editor");
        expect(newElement.value).toEqual("");
        // redo
        fireEvent.keyDown(element, {
          key: "z",
          keyCode: 122,
          ctrlKey: true,
          shiftKey: true,
        });
        newElement = screen.getByTestId("markdown-editor");
        expect(newElement.value).toEqual("abc");
      });
    });
    describe("bold command should insert bold tags", () => {
      it("ctrl+b", () => {
        fireEvent.change(element, { target: { value: "abc" } });
        fireEvent.keyDown(element, { key: "b", keyCode: 98, ctrlKey: true });
        const newElement = screen.getByTestId("markdown-editor");
        expect(newElement.value).toEqual("abc****");
      });
      it("cmd+b", () => {
        fireEvent.change(element, { target: { value: "abc" } });
        fireEvent.keyDown(element, { key: "b", keyCode: 98, metaKey: true });
        const newElement = screen.getByTestId("markdown-editor");
        expect(newElement.value).toEqual("abc****");
      });
    });
    describe("italic command should insert italic tags", () => {
      it("ctrl+i", () => {
        fireEvent.change(element, { target: { value: "abc" } });
        fireEvent.keyDown(element, { key: "i", keyCode: 105, ctrlKey: true });
        const newElement = screen.getByTestId("markdown-editor");
        expect(newElement.value).toEqual("abc__");
      });
      it("cmd+i", () => {
        fireEvent.change(element, { target: { value: "abc" } });
        fireEvent.keyDown(element, { key: "i", keyCode: 105, metaKey: true });
        const newElement = screen.getByTestId("markdown-editor");
        expect(newElement.value).toEqual("abc__");
      });
    });
  });
});
