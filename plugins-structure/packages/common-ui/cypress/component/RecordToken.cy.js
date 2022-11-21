import React from "react";
import { RecordToken } from "../../src/components/RecordToken";

describe("Given <RecordToken />", () => {
  const token = "abcdefghijklmnopqrstuvwxyz";
  it("should render default token", () => {
    cy.mount(<RecordToken token={token} />);
    cy.get(`#record-token-${token}`).should("have.text", token);
  });
  it("should render copyable token", () => {
    cy.mount(<RecordToken token={token} isCopyable />);
    cy.get(`#record-token-${token}`).should("have.text", token);
    cy.get("svg").click();
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq(token);
      });
    });
  });
});
