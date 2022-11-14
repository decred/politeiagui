import React from "react";
import { Join } from "../../src/components/Join";

describe("Given <Join/>", () => {
  it("should join terms with separator on large screens", () => {
    cy.viewport("macbook-16");
    cy.mount(
      <Join>
        <span className="item">abc</span>
        <span className="item">def</span>
      </Join>
    );
    cy.get("[data-testid=join-default-separator]")
      .should("be.visible")
      .and("have.length", 1);
    cy.get(".item").should("have.length", 2);
  });
  it("should join skipping lines on mobile devices", () => {
    cy.viewport("iphone-x");
    cy.mount(
      <Join>
        <span className="item">abc</span>
        <span className="item">def</span>
      </Join>
    );
    cy.get("[data-testid=join-default-separator]").should("not.be.visible");
    cy.get(".item").should("have.length", 2);
  });
  it("should join inline regardless the screen size", () => {
    cy.viewport("macbook-16");
    cy.mount(
      <Join inline>
        <span className="item">abc</span>
        <span className="item">def</span>
      </Join>
    );
    cy.get("[data-testid=join-default-separator]").should("be.visible");
    cy.get(".item").should("have.length", 2);
    cy.viewport("iphone-x");
    cy.get("[data-testid=join-default-separator]").should("be.visible");
    cy.get(".item").should("have.length", 2);
  });
  it("should not include falsy elements on join", () => {
    cy.mount(
      <Join inline className="join">
        <span>abc</span>
        <span>def</span>
        {null}
        {false}
      </Join>
    );
    // include 2 spans + 1 separator
    cy.get(".join").children().should("have.length", 3);
  });
});
