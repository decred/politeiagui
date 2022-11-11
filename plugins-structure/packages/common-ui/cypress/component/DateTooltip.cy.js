import React from "react";
import { DateTooltip } from "../../src/components/DateTooltip";

const now = new Date(2021, 3, 14); // month is 0-indexed
const relativeDate = new Date(2021, 3, 10);

describe("Given <DateTooltip />", () => {
  beforeEach(() => {
    cy.clock(now);
  });
  it("should return correct relative tooltip", () => {
    cy.mount(
      <DateTooltip
        timestamp={relativeDate.getTime() / 1000}
        placement="bottom"
        data-testid="date"
        contentClassName="test"
      >
        {({ timeAgo }) => <div data-testid="timeago">{timeAgo}</div>}
      </DateTooltip>
    );
    cy.get("[data-testid=timeago]").should("have.text", "4 days ago");
    cy.get(".test")
      .should("be.visible")
      .and("have.text", relativeDate.toUTCString());
  });
});
