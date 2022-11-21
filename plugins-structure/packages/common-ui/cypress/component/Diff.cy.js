import React from "react";
import { MarkdownDiffHTML, RawDiff } from "../../src/components/Diff";

describe("Given <RawDiff />", () => {
  it("should render raw diff", () => {
    cy.mount(<RawDiff oldText="abc" newText="def" />);
    // Should have 2 lines
    cy.get("[data-testid=raw-diff-line-1").should("have.text", "abc");
    cy.get("[data-testid=raw-diff-line-2").should("have.text", "def");
  });
});

describe("Given <MarkdownDiffHTML/>", () => {
  it("should render HTML diff for markdown", () => {
    cy.mount(<MarkdownDiffHTML oldText="abc" newText="def" />);
    cy.get(".removed").should("have.text", "abc");
    cy.get(".added").should("have.text", "def");
  });
});
