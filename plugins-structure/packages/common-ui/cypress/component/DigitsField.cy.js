import React, { useState } from "react";
import { DigitsField } from "../../src";

Cypress.Commands.add("assertCode", (code, selector = ".digits input") =>
  cy.get(selector).each((el, i) => {
    expect(el.val()).to.eq(code.charAt(i));
  })
);

const DigitsChangeWrapper = ({ className }) => {
  const [code, setCode] = useState("");
  return <DigitsField className={className} code={code} onChange={setCode} />;
};

describe("Given <DigitsField />", () => {
  it("should render field without code", () => {
    cy.mount(<DigitsField className="digits" />);
    cy.get(".digits input").each((el) => {
      expect(el.val()).to.eq("");
    });
  });
  it("should change code", () => {
    const code = "123456";
    cy.mount(<DigitsChangeWrapper className="digits" />);
    cy.get(".digits").type(code);
    cy.assertCode(code);
  });
  it("should render custom length", () => {
    const code = "1234567890";
    cy.mount(<DigitsField className="digits" code={code} length={10} />);
    cy.assertCode(code);
  });
  it("should crop code to digits length", () => {
    cy.mount(<DigitsField className="digits" code="1234567890" length={5} />);
    cy.assertCode("12345");
  });
});
