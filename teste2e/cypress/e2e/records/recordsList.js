import { shortRecordToken } from "../../utils";

const statusByTab = {
  "Under Review": ["started", "authorized", "unauthorized"],
  Approved: ["approved"],
  Rejected: ["rejected"],
  Abandoned: ["ineligible"],
  Unreviewed: ["unreviewed"],
  Censored: ["censored"]
};

const RECORDS_PAGE_SIZE = 5;
const INVENTORY_PAGE_SIZE = 20;

const getTokensByStatusTab = (inventory, currentTab) =>
  statusByTab[currentTab]
    ? statusByTab[currentTab].reduce(
        (acc, status) => [...acc, ...(inventory[status] || [])],
        []
      )
    : [];

const underReviewPaginationCases = [
  {
    title: "Zero page",
    inventory: {
      authorized: 0,
      started: 0,
      unauthorized: 1
    },
  } , {
    title: "Fill up statuses",
    inventory: {
      authorized: 1,
      started: 1,
      unauthorized: 1
    },
  } , {
    title: "1 page",
    inventory: {
      authorized: 10,
      started: 3,
      unauthorized: 25
    },
  }, {
    title: "2 page",
    inventory: {
      authorized: 20,
      started: 3,
      unauthorized: 40
    },
  }
];

const scanPage = (inventory) => {
  cy.visit(`/`);
  const started = inventory.started || 0;
  const authorized = inventory.authorized || 0;
  const unauthorized = inventory.unauthorized || 0;
  const total = started + authorized + unauthorized;
  const statuses = [started, authorized, unauthorized];
  let page = 1, statusIndex = 0, oldFilledStatusTokens = 0, oldInventoryPage;

  const scanStatus = (currentStatusIndex, willFetchedTokens) => {
    const nextStatusIndex = currentStatusIndex + 1;
    if (nextStatusIndex >= statuses.length) {
      return currentStatusIndex;
    }
    const nextStatusTokens = statuses[nextStatusIndex]
    oldFilledStatusTokens += statuses[currentStatusIndex];
    if (nextStatusTokens + oldFilledStatusTokens < willFetchedTokens) {
      return scanStatus(nextStatusIndex)
    }
    return nextStatusIndex
  }

  do {
    if (!statuses[statusIndex]) {
      return
    }
    const tokensInStatus = statuses[statusIndex];
    const willFetchedTokens = page * RECORDS_PAGE_SIZE;

    if (willFetchedTokens > oldFilledStatusTokens + tokensInStatus && statusIndex +1 < statuses.length) {
      // switch to next status
      statusIndex = scanStatus(statusIndex, willFetchedTokens);
      oldInventoryPage = 0;
    }
    const inventoryPage = Math.floor((willFetchedTokens - oldFilledStatusTokens) /  INVENTORY_PAGE_SIZE);
    if (page === 1) {
      // fist page fetch all statuses
      cy.wait("@ticketvote.inventory");
    } else if (inventoryPage !== oldInventoryPage && tokensInStatus >= inventoryPage * INVENTORY_PAGE_SIZE) {
      // fetch next page
      oldInventoryPage = inventoryPage;
      cy.wait("@ticketvote.inventory").its("request.body.page").should("eq", inventoryPage + 1);
    }
    cy.wait("@records.records");

    if (willFetchedTokens > total) {
      cy.assertListLengthByTestId("record-title", total);
      cy.scrollTo("bottom");
      // wait to see if no requests are done, since inventory is fully fetched
      cy.wait(1000);
      cy.assertListLengthByTestId("record-title", total);
    } else {
      cy.assertListLengthByTestId("record-title", RECORDS_PAGE_SIZE * page);
      cy.scrollTo("bottom");
    }
    page += 1;
  } while (page  <= Math.ceil(total / RECORDS_PAGE_SIZE));
}

describe("Records list", () => {
  underReviewPaginationCases.forEach((config) => {
    describe(`Under review render records and inventory pagination correctly: ${config.title}`, () => {
      before(() => {
        cy.middleware("ticketvote.inventory", config.inventory);
        cy.middleware("records.records");
      });
      it("Render", () => {
        scanPage(config.inventory)
      })
    })
  })

  describe("proposals list", () => {
    beforeEach(() => {
      cy.middleware("ticketvote.inventory", {
        approved: 4,
        authorized: 0,
        ineligible: 3,
        rejected: 5,
        started: 3,
        unauthorized: 25
      });
      cy.middleware("records.records");
    });
    it("can render first proposals batch according to inventory order", () => {
      let inventory;
      cy.visit(`/`);
      cy.wait("@ticketvote.inventory").then(({ response: { body } }) => {
        inventory = body.vetted;
      });
      cy.wait("@records.records");
      // each proposal should be rendered accordingly to inventory response
      cy.assertListLengthByTestId("record-title", RECORDS_PAGE_SIZE) // first records batch
        .each(([{ id }], position) => {
          const tokens = getTokensByStatusTab(inventory, "Under Review");
          const expectedToken = shortRecordToken(tokens[position]);
          expect(id).to.have.string(expectedToken);
        });
    });
    it("can switch tabs and load proposals correctly", () => {
      cy.visit("/?tab=approved");
      cy.wait("@ticketvote.inventory");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 4);
      // navigate to in discussion tab
      cy.findByTestId("tab-0").click();
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 5);
    });
    it("can list legacy proposals", () => {
      // for approved proposals
      cy.visit("/?tab=approved");
      cy.wait("@ticketvote.inventory");
      cy.wait(1000);
      cy.assertListLengthByTestId("record-title-legacy", 58);
      // for rejected proposals
      cy.visit("/?tab=rejected");
      cy.wait(1000);
      cy.assertListLengthByTestId("record-title-legacy", 37);
      // for abandoned proposals
      cy.visit("/?tab=abandoned");
      cy.wait(1000);
      cy.assertListLengthByTestId("record-title-legacy", 20);
    });
    it("can load sidebar according to screen resolution", () => {
      cy.visit("/");
      cy.findByTestId("sidebar").should("be.visible");
      cy.viewport("iphone-6");
      cy.findByTestId("sidebar").should("be.hidden");
      cy.viewport(1000, 500); // sidebar breakpoint
      cy.findByTestId("sidebar").should("be.hidden");
      cy.viewport(1001, 500);
      cy.findByTestId("sidebar").should("be.visible");
    });
    it("can render loading placeholders properly", () => {
      cy.visit(`/`);
      cy.get('[data-testid="loading-placeholders"] > div').should(
        "have.length",
        5
      );
    });
  });

  describe("admin proposals list", () => {
    beforeEach(() => {
      const admin = {
        email: "adminuser@example.com",
        username: "adminuser",
        password: "password"
      };
      cy.middleware("records.inventory", {
        unreviewed: 22,
        censored: 8
      });
      cy.middleware("records.records");
      cy.login(admin);
    });
    it("can render records list according to inventory order", () => {
      let inventory;
      cy.visit("/admin/records");
      cy.wait("@records.inventory").then(({ response: { body } }) => {
        inventory = body.unvetted;
      });
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", RECORDS_PAGE_SIZE) // first records batch
        .each(([{ id }], position) => {
          const tokens = getTokensByStatusTab(inventory, "Unreviewed");
          const expectedToken = shortRecordToken(tokens[position]);
          expect(id).to.have.string(expectedToken);
        });
    });
    it("can render records and inventory pagination correctly", () => {
      cy.visit("/admin/records");
      cy.wait("@records.inventory");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 5);
      cy.scrollTo("bottom");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 10);
      cy.scrollTo("bottom");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 15);
      cy.scrollTo("bottom");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 20);
      cy.scrollTo("bottom");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 22);
      cy.scrollTo("bottom");
      cy.wait(1000);
      cy.assertListLengthByTestId("record-title", 22);
    });
    it("can switch tabs and load proposals correctly", () => {
      cy.visit("/admin/records?tab=unreviewed");
      cy.wait("@records.inventory");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 5);
      cy.findByTestId("tab-1").click();
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 5);
      cy.findByTestId("tab-0").click();
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 10);
    });
  });
});
