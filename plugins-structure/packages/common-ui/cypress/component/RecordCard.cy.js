import React from "react";
import { RecordCard } from "../../src/components/RecordCard";

const props = {
  title: "My Record",
  titleLink: "/my-record",
  subtitle: "My record subtitle",
  rightHeader: "Right Header Tag",
  rightHeaderSubtitle: "Right header subtitle",
  secondRow: "Second Row",
  thirdRow: "Third Row",
  fourthRow: "Fourth Row",
  footer: "footer",
  isDimmed: false,
};

describe("<RecordCard />", () => {
  it("should render card without props", () => {
    cy.mount(<RecordCard />);
    cy.get("[data-testid=record-card-title]").should("exist");
    cy.get("[data-testid=record-card-right-header]").should("exist");
    cy.get("[data-testid=record-card-subtitle]").should("exist");
    cy.get("[data-testid=record-card-second-row]").should("not.exist");
    cy.get("[data-testid=record-card-third-row]").should("not.exist");
    cy.get("[data-testid=record-card-fourth-row]").should("not.exist");
    cy.get("[data-testid=record-card-footer]").should("exist");
  });
  it("should render title properly", () => {
    cy.mount(<RecordCard title={props.title} />);
    cy.get("[data-testid=record-card-title]").should("have.text", props.title);
  });
  it("should render title links properly", () => {
    cy.mount(<RecordCard title={props.title} titleLink={props.titleLink} />);
    cy.get("[data-testid=record-card-title]").should("have.text", props.title);
    cy.get("[data-testid=record-card-title-link]")
      .should("have.attr", "href")
      .and("equal", props.titleLink);
  });
  it("should render card properly with all props", () => {
    cy.mount(<RecordCard {...props} />);
    cy.get("[data-testid=record-card-subtitle]").should(
      "have.text",
      props.subtitle
    );
    cy.get("[data-testid=record-card-right-header]").should(
      "have.text",
      props.rightHeader + props.rightHeaderSubtitle
    );
    cy.get("[data-testid=record-card-second-row]").should(
      "have.text",
      props.secondRow
    );
    cy.get("[data-testid=record-card-third-row]").should(
      "have.text",
      props.thirdRow
    );
    cy.get("[data-testid=record-card-fourth-row]")
      .should("have.text", props.fourthRow)
      .and("have.css", "border-color");
    cy.get("[data-testid=record-card-footer]").should(
      "have.text",
      props.footer
    );
  });
});
