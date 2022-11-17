/* eslint-disable cypress/no-unnecessary-waiting */
import React, { useEffect, useState } from "react";
import { RecordsList } from "../../src/components/RecordsList";

const listSize = 40;

const getListElements = (size) =>
  Array(size)
    .fill("")
    .map((_, i) => (
      <div key={i} data-testid="record-test-el" style={{ height: "20px" }}>
        Record {i}
      </div>
    ));

const Page = ({ childrenThreshold }) => {
  const [size, setSize] = useState(listSize);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (size > listSize + 20) {
      setHasMore(false);
    }
  }, [size]);

  return (
    <RecordsList
      hasMore={hasMore}
      childrenThreshold={childrenThreshold}
      onFetchMore={() => {
        setSize(size + 10);
      }}
    >
      {getListElements(size)}
    </RecordsList>
  );
};

describe("Given <RecordsList />", () => {
  it("should render all list elements", () => {
    cy.mount(<RecordsList>{getListElements(listSize)}</RecordsList>);
    cy.get("[data-testid=record-test-el]").should("have.length", listSize);
  });
  it("should load more elements on list", () => {
    const actions = {
      loadMore: () => {},
    };
    const loadMore = cy.spy(actions, "loadMore");
    cy.mount(
      <RecordsList hasMore={true} onFetchMore={actions.loadMore}>
        {getListElements(30)}
      </RecordsList>
    );
    cy.scrollTo("bottom");
    cy.scrollTo("top");
    cy.scrollTo("bottom");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000).then(() => {
      expect(loadMore).to.have.callCount(1);
    });
  });
  it("should display loading placeholders", () => {
    cy.mount(
      <RecordsList
        isLoading={true}
        loadingSkeleton={<div data-testid="loading">LOADING</div>}
      >
        {[]}
      </RecordsList>
    );
    cy.get("[data-testid=loading]").should("be.visible");
  });
});

describe("Given <RecordsList /> rendering an dynamic page", () => {
  it("should render items dynamically", () => {
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
  it("should not render more items when threshold", () => {
    cy.mount(<Page childrenThreshold={100} />);
    // Threshold > list length. Don't load more items.
    cy.scrollTo("bottom");
    cy.wait(200);
    cy.get("[data-testid=record-test-el]").should("have.length", listSize);
  });
});
