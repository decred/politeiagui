/* eslint-disable cypress/no-unnecessary-waiting */
import React from "react";
import { InfiniteScroller } from "../../src/components/InfiniteScroller";

const listSize = 40;

const getListElements = (size) =>
  Array(size)
    .fill("")
    .map((_, i) => (
      <div key={i} data-testid="record-test-el" style={{ height: "20px" }}>
        Record {i}
      </div>
    ));

const Page = () => {
  const [size, setSize] = React.useState(listSize);
  const [hasMore, setHasMore] = React.useState(true);

  React.useEffect(() => {
    if (size > listSize + 20) {
      setHasMore(false);
    }
  }, [size]);

  return (
    <InfiniteScroller
      hasMore={hasMore}
      loadMore={() => {
        setSize(size + 10);
      }}
    >
      {getListElements(size)}
    </InfiniteScroller>
  );
};

describe("Given <InfiniteScroller />", () => {
  it("should render infinite scolling list", () => {
    cy.mount(<Page />);
    cy.scrollTo("bottom");
    cy.wait(200);
    cy.get("[data-testid=record-test-el]").should("have.length", listSize + 10);
    cy.scrollTo("bottom");
    cy.wait(200);
    cy.get("[data-testid=record-test-el]").should("have.length", listSize + 20);
    cy.scrollTo("bottom");
    cy.wait(200);
    cy.get("[data-testid=record-test-el]").should("have.length", listSize + 30);
    // Don't load more items. Page disables `hasMore` after 3 scrolls.
    cy.scrollTo("bottom");
    cy.wait(200);
    cy.get("[data-testid=record-test-el]").should("have.length", listSize + 30);
  });
});
