/* eslint-disable cypress/no-unnecessary-waiting */
import React from "react";
import { Provider, useSelector } from "react-redux";
import { ProposalsList } from "../../src/components";
import {
  actions,
  asyncActions,
  store,
  withDispatch,
} from "../../src/pi/dev/mocks/store";

const List = (props = {}) => {
  const inventoryFetchStatus = useSelector((state) => state.inventoryStatus);
  const inventory = useSelector((state) => state.inventory);
  return (
    <ProposalsList
      inventory={inventory}
      inventoryFetchStatus={inventoryFetchStatus}
      {...props}
    />
  );
};
const Wrapper = (props = {}) => {
  return (
    <Provider store={store}>
      <List {...props} />
    </Provider>
  );
};

describe("Given <ProposalsList/>", () => {
  let fetchNextBatchSpy, fetchNextPageSpy, fetchDoneSpy;
  beforeEach(async () => {
    await store.dispatch(asyncActions.onFetchNextBatch());
    fetchNextBatchSpy = cy.spy(asyncActions, "onFetchNextBatch");
    fetchNextPageSpy = cy.spy(asyncActions, "onFetchNextInventoryPage");
    fetchDoneSpy = cy.spy(actions, "onFetchDone");
  });
  afterEach(() => {
    store.dispatch(actions.clear());
  });
  it("should load first items batch, but not load more", () => {
    const { inventory, inventoryStatus } = store.getState();
    cy.mount(
      <Wrapper
        inventory={inventory}
        inventoryFetchStatus={inventoryStatus}
        onFetchNextBatch={withDispatch(asyncActions.onFetchNextBatch)}
        onFetchNextInventoryPage={withDispatch(
          asyncActions.onFetchNextInventoryPage
        )}
        onFetchDone={withDispatch(actions.onFetchDone)}
      />
    );
    cy.get("[data-testid=proposal-card]")
      .should("have.length", 5)
      .then(() => {
        expect(fetchNextBatchSpy).to.have.callCount(0);
        expect(fetchNextPageSpy).to.have.callCount(0);
        expect(fetchDoneSpy).to.have.callCount(0);
      });
  });
  it("should show proposal loader when loading", () => {
    const { inventory, inventoryStatus } = store.getState();
    cy.mount(
      <Wrapper
        inventory={inventory}
        inventoryFetchStatus={inventoryStatus}
        listFetchStatus="loading"
        onFetchNextBatch={() => {}}
        onFetchNextInventoryPage={() => {}}
        onFetchDone={() => {}}
      />
    );
    cy.get("[data-testid=proposal-loader]").should("have.length", 5);
  });
  it("should fetch next proposals batch", () => {
    const { inventory, inventoryStatus } = store.getState();
    cy.mount(
      <Wrapper
        inventory={inventory}
        inventoryFetchStatus={inventoryStatus}
        onFetchNextBatch={withDispatch(asyncActions.onFetchNextBatch)}
        onFetchNextInventoryPage={withDispatch(
          asyncActions.onFetchNextInventoryPage
        )}
        onFetchDone={withDispatch(actions.onFetchDone)}
      />
    );
    cy.scrollTo("bottom");
    cy.wait(100);
    cy.get("[data-testid=proposal-card]").then(() => {
      expect(fetchNextBatchSpy).to.have.callCount(1);
      expect(fetchNextPageSpy).to.have.callCount(0);
      expect(fetchDoneSpy).to.have.callCount(0);
    });
  });
  it("should fetch next inventory page", () => {
    cy.mount(
      <Wrapper
        onFetchNextBatch={withDispatch(asyncActions.onFetchNextBatch)}
        onFetchNextInventoryPage={withDispatch(
          asyncActions.onFetchNextInventoryPage
        )}
        onFetchDone={withDispatch(actions.onFetchDone)}
      />
    );
    for (let i = 0; i < 6; i++) {
      cy.scrollTo("bottom", { duration: 300 });
      cy.wait(100);
    }
    cy.wait(100).then(() => {
      expect(fetchNextPageSpy).to.have.callCount(1);
    });
  });
  it("should fetch call onFetchDone after fetch is done", () => {
    cy.mount(
      <Wrapper
        onFetchNextBatch={withDispatch(asyncActions.onFetchNextBatch)}
        onFetchNextInventoryPage={withDispatch(
          asyncActions.onFetchNextInventoryPage
        )}
        onFetchDone={withDispatch(actions.onFetchDone)}
      />
    );
    for (let i = 0; i < 30; i++) {
      cy.scrollTo("bottom", { duration: 300 });
    }

    cy.wait(100).then(() => {
      expect(fetchNextBatchSpy).to.have.callCount(11);
      expect(fetchNextPageSpy).to.have.callCount(2);
      expect(fetchDoneSpy).to.have.callCount(1);
    });
  });
});
