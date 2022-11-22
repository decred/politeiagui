import React, { useState } from "react";
import { RecordsList } from "../../src/components/RecordsList";

const height = 40;
// Actions to spy
const actions = {
  fetchNextBatch: () => {},
  fetchNextPage: () => {},
  fetchDone: () => {},
};

const Record = ({ record }) => (
  <div className="record" style={{ height: `${height}px` }}>
    {record.name}
  </div>
);
const LoadingPlaceholder = () => <div className="loading">Loading</div>;

function getInventory(size) {
  return Array(size)
    .fill("")
    .map((_, i) => `token-${i}`);
}
function getRecords(inventory) {
  return inventory.reduce(
    (acc, token) => ({
      ...acc,
      [token]: { name: `Record-${token}`, status: 2, state: 2 },
    }),
    {}
  );
}
function getRecordsList(records) {
  return records.map((record, k) => <Record key={k} record={record} />);
}

const Page = ({
  batchSize,
  inventorySize,
  maxSize,
  onFetchNextBatch,
  onFetchNextPage,
  onFetchDone,
}) => {
  const [size, setSize] = useState(inventorySize);
  const [listStatus, setListStatus] = useState("idle");
  const [recordsSize, setRecordsSize] = useState(batchSize);

  const inventory = getInventory(size);
  const records = getRecords(inventory.slice(0, recordsSize));

  const handleLoadRecords = () => {
    setListStatus("loading");
    setTimeout(() => {
      onFetchNextBatch();
      setRecordsSize(recordsSize + batchSize);
      setListStatus("succeeded");
    }, 100);
  };

  return (
    <RecordsList
      inventory={inventory}
      records={records}
      inventoryFetchStatus={
        size < maxSize ? "succeeded/hasMore" : "succeeded/isDone"
      }
      listPageSize={batchSize}
      listFetchStatus={listStatus}
      onFetchNextInventoryPage={() => {
        onFetchNextPage();
        setSize(size + inventorySize);
        handleLoadRecords();
      }}
      onFetchNextBatch={() => {
        handleLoadRecords();
      }}
      onFetchDone={onFetchDone}
    >
      {getRecordsList}
    </RecordsList>
  );
};

Cypress.Commands.add(
  "mountAndScrollList",
  ({ inventorySize, maxSize, batchSize, screenHeight = 600, scrollCount }) => {
    cy.viewport(500, screenHeight);
    cy.mount(
      <Page
        batchSize={batchSize}
        inventorySize={inventorySize}
        maxSize={maxSize}
        onFetchNextBatch={actions.fetchNextBatch}
        onFetchNextPage={actions.fetchNextPage}
        onFetchDone={actions.fetchDone}
      />
    );
    cy.wrap(Array(scrollCount)).each(() => {
      cy.scrollTo("bottom", { duration: 100 });
    });
  }
);

describe("Given <RecordsList />", () => {
  it("should render all list elements", () => {
    const wantSize = 10;
    const inventory = getInventory(wantSize);
    const records = getRecords(inventory);
    cy.mount(
      <RecordsList inventory={inventory} records={records}>
        {getRecordsList}
      </RecordsList>
    );
    cy.get(".record").should("have.length", wantSize);
  });
  it("should load more elements on list", () => {
    const inventory = getInventory(40);
    const incompleteRecords = getRecords(inventory.slice(0, 20));

    const fetchNextBatchSpy = cy.spy(actions, "fetchNextBatch");
    cy.mount(
      <RecordsList
        inventory={inventory}
        records={incompleteRecords}
        onFetchNextBatch={actions.fetchNextBatch}
      >
        {getRecordsList}
      </RecordsList>
    );
    cy.scrollTo("bottom", { duration: 100 });
    cy.scrollTo("top", { duration: 100 }).then(() => {
      expect(fetchNextBatchSpy).to.have.callCount(1);
    });
  });
  it("should display loading placeholders", () => {
    const wantSize = 5;
    cy.mount(
      <RecordsList
        listFetchStatus="loading"
        inventoryFetchStatus="succeeded/isDone"
        inventory={getInventory(wantSize)}
        records={{}}
        loadingPlaceholder={LoadingPlaceholder}
      >
        {getRecordsList}
      </RecordsList>
    );
    cy.get(".loading").should("be.visible").and("have.length", 5);
  });
});

describe("Given <RecordsList /> rendering an dynamic page", () => {
  let fetchNextBatchSpy;
  let fetchNextPageSpy;
  let fetchDoneSpy;
  beforeEach(() => {
    fetchNextBatchSpy = cy.spy(actions, "fetchNextBatch");
    fetchNextPageSpy = cy.spy(actions, "fetchNextPage");
    fetchDoneSpy = cy.spy(actions, "fetchDone");
  });
  it("should initially load batches until screen is filled", () => {
    const batchSize = 5;
    cy.mountAndScrollList({
      batchSize,
      inventorySize: 20,
      maxSize: 40,
      scrollCount: 0,
    });
    cy.get(".record")
      .should("have.length", 3 * batchSize)
      .then(() => {
        // 2 to fill the screen, considering 1 is initial
        expect(fetchNextBatchSpy).to.have.callCount(2);
        // no next inventory page calls
        expect(fetchNextPageSpy).to.have.callCount(0);
        // page is not done
        expect(fetchDoneSpy).to.have.callCount(0);
      });
  });
  it("should load next inventory page when needed", () => {
    const batchSize = 20;
    cy.mountAndScrollList({
      maxSize: 60,
      batchSize,
      inventorySize: 20,
      scrollCount: 1,
    });
    cy.get(".record")
      .should("have.length", batchSize * 2)
      .then(() => {
        // 1 batch call for each scroll
        expect(fetchNextBatchSpy).to.have.callCount(1);
        // 1 inventory page calls
        expect(fetchNextPageSpy).to.have.callCount(1);
        // page is not done
        expect(fetchDoneSpy).to.have.callCount(0);
      });
  });
  it("should call fetchDone when list fetch is done", () => {
    const batchSize = 20;
    cy.mountAndScrollList({
      batchSize,
      maxSize: batchSize,
      inventorySize: batchSize,
      scrollCount: 1,
    });
    cy.get(".record")
      .should("have.length", batchSize)
      .then(() => {
        expect(fetchDoneSpy).to.have.callCount(1);
      });
  });
  it("should call fetchDone when list fetch is empty, but not call other actions", () => {
    cy.mountAndScrollList({
      batchSize: 0,
      maxSize: 0,
      inventorySize: 0,
      scrollCount: 0,
    });
    cy.get(".record")
      .should("have.length", 0)
      .then(() => {
        expect(fetchNextBatchSpy).to.have.callCount(0);
        expect(fetchNextPageSpy).to.have.callCount(0);
        expect(fetchDoneSpy).to.have.callCount(1);
      });
  });
  it("should not trigger repeated calls", () => {
    cy.mountAndScrollList({
      batchSize: 10,
      maxSize: 40,
      inventorySize: 20,
      scrollCount: 4,
    });
    cy.get(".record")
      .should("have.length", 40)
      .then(() => {
        expect(fetchNextBatchSpy).to.have.callCount(3);
        expect(fetchNextPageSpy).to.have.callCount(1);
        expect(fetchDoneSpy).to.have.callCount(1);
      });
    // Scroll top and scroll back to list end, in order to try to force list
    // calls again.
    cy.scrollTo("top", { duration: 100 });
    cy.scrollTo("bottom", { duration: 100 });
    // Assert nothing has changed
    cy.get(".record")
      .should("have.length", 40)
      .then(() => {
        expect(fetchNextBatchSpy).to.have.callCount(3);
        expect(fetchNextPageSpy).to.have.callCount(1);
        expect(fetchDoneSpy).to.have.callCount(1);
      });
  });
});
