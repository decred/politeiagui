import React from "react";
import { render, screen } from "@testing-library/react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import "@testing-library/jest-dom";

const textBody =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam bibendum sollicitudin nulla quis auctor. Phasellus sit amet orci imperdiet, pharetra metus a, fringilla urna.";

describe("Given MarkdownRenderer component", () => {
  it("should render markdown text", async () => {
    render(<MarkdownRenderer body={textBody} />);

    // await waitFor(() => screen.findByTestId("markdown-renderer"));

    expect(await screen.findByTestId("markdown-renderer")).toHaveTextContent(
      "Lorem ipsum"
    );
  });
});
