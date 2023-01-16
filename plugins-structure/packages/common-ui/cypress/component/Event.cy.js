import React from "react";
import { Event } from "../../src/components/Event";

const now = new Date(2021, 3, 14); // month is 0-indexed
const relativeDate = new Date(2021, 3, 10);
const timestamp = relativeDate.getTime() / 1000;

describe("Given <Event/>", () => {
  beforeEach(() => {
    cy.clock(now);
  });
  it("should render events properly", () => {
    cy.mount(<Event event="test" timestamp={timestamp} className="event" />);
    cy.get(".event").should("have.text", "test 4 days ago");
  });
  it("should render timeago when no event is passed", () => {
    cy.mount(<Event timestamp={timestamp} className="event" />);
    cy.get(".event").should("have.text", "4 days ago");
  });
});
