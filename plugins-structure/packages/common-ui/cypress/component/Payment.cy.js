import React from "react";
import { Payment } from "../../src";

describe("Given <Payment />", () => {
  const address = "myaddress";
  const value = 10;
  it("should render qrcode and amount", () => {
    cy.mount(<Payment address={address} value={value} />);
    cy.get("[data-testid=payment-code]")
      .should("be.visible")
      .and("have.attr", "alt", address);
    cy.get("[data-testid=payment-value]").should("include.text", value);
    cy.get("[data-testid=payment-address]").should("include.text", address);
  });
});
