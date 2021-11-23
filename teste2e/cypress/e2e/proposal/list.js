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

const getTokensByStatusTab = (inventory, currentTab) =>
  statusByTab[currentTab]
    ? statusByTab[currentTab].reduce(
        (acc, status) => [...acc, ...(inventory[status] || [])],
        []
      )
    : [];

beforeEach(function mockApiCalls() {
  // currently mocking pi and ticketvote summaries calls with any status, since
  // they aren't used for assertions. the `Missing` status will show up, but it
  // doesn't affect the list behavior.
  cy.useTicketvoteApi();
  cy.useRecordsApi();
  cy.usePiApi();
  cy.useWwwApi();
  cy.useCommentsApi();
  cy.userEnvironment("noLogin");
});

describe("Multiple status tab", () => {
  beforeEach(() => {
    cy.recordsMiddleware("records", { status: 2, state: 2 });
  });
  it("should render list correctly when some statuses are empty", () => {
    const amountByStatus = { authorized: 0, started: 0, unauthorized: 1 };
    cy.ticketvoteMiddleware("inventory", { amountByStatus });
    cy.ticketvoteMiddleware("summaries", { amountByStatus });
    cy.piMiddleware("summaries", {
      amountByStatus: {
        "under-review": 1
      }
    });
    // Test
    cy.visit("/");
    cy.wait("@ticketvote.inventory");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 1);
    cy.scrollTo("bottom");
    // wait to see if no requests are done, since inventory is fully fetched
    cy.wait(1000);
    cy.assertListLengthByTestId("record-title", 1);
  });
  it("should render all status even when page batch is not complete", () => {
    // Inventory Setup
    const amountByStatus = { authorized: 1, started: 1, unauthorized: 1 };
    cy.ticketvoteMiddleware("inventory", { amountByStatus });
    cy.ticketvoteMiddleware("summaries", { amountByStatus });
    cy.piMiddleware("summaries", {
      amountByStatus: {
        "vote-authorized": 1,
        "vote-started": 1,
        "under-review": 1
      }
    });
    // Test
    cy.visit("/");
    cy.wait("@ticketvote.inventory");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 3);
    cy.scrollTo("bottom");
    // wait to see if no requests are done, since inventory is fully fetched
    cy.wait(1000);
    cy.assertListLengthByTestId("record-title", 3);
  });
  it("should fetch all inventory tokens", () => {
    // Inventory Setup
    cy.ticketvoteMiddleware("inventory", {
      amountByStatus: { started: 3, authorized: 20, unauthorized: 45 }
    });
    // Test
    cy.visit("/");
    cy.wait("@ticketvote.inventory");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 5);
    // 3 started and 2 authorized
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 10);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 15);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 20);
    // fetch 3 authorized and 2 unauthorized
    cy.scrollTo("bottom");
    // prepare to fetch 25 items: 3 started, 20 authorized and 2 unauthorized
    // scan inventory: page 2 of authorized
    cy.wait("@ticketvote.inventory")
      .its("request.body")
      .should("deep.eq", { page: 2, status: 2 });
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 25);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 30);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 35);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 40);
    cy.scrollTo("bottom");
    // prepare to fetch 45 items: 3 started, 20 authorized and 22 unauthorized
    // scan inventory: page 2 of unauthorized
    cy.wait("@ticketvote.inventory")
      .its("request.body")
      .should("deep.eq", { page: 2, status: 1 });
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 45);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 50);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 55);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 60);
    cy.scrollTo("bottom");
    // prepare to fetch 65 items: 3 started, 20 authorized and 42 unauthorized
    // scan inventory: page 3 of unauthorized
    cy.wait("@ticketvote.inventory")
      .its("request.body")
      .should("deep.eq", { page: 3, status: 1 });
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 65);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 68);
    cy.scrollTo("bottom");
    // wait to see if no requests are done, since inventory is fully fetched
    cy.wait(1000);
    cy.assertListLengthByTestId("record-title", 68);
  });
});

describe("General pagination", () => {
  beforeEach(() => {
    cy.ticketvoteMiddleware("inventory", {
      amountByStatus: {
        approved: 4,
        authorized: 0,
        ineligible: 3,
        rejected: 5,
        started: 3,
        unauthorized: 25
      }
    });
    cy.recordsMiddleware("records", { status: 2, state: 2 });
  });
  it("should render first proposals batch according to inventory order", () => {
    let inventory;
    cy.visit("/");
    cy.wait("@ticketvote.inventory").then(({ response: { body } }) => {
      inventory = body.vetted;
    });
    cy.wait("@records.records");
    // each proposal should be rendered accordingly to inventory response
    cy.assertListLengthByTestId("record-title", RECORDS_PAGE_SIZE).each(
      ([{ id }], position) => {
        const tokens = getTokensByStatusTab(inventory, "Under Review");
        const expectedToken = shortRecordToken(tokens[position]);
        expect(id).to.have.string(expectedToken);
      }
    );
  });
  it("should switch tabs and load proposals correctly", () => {
    cy.visit("/?tab=approved");
    cy.wait("@ticketvote.inventory");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 4);
    // navigate to in discussion tab
    cy.findByTestId("tab-0").click();
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 5);
  });
  it("should list legacy proposals", () => {
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
    cy.recordsMiddleware("records", { status: 3, state: 2 });
    cy.visit("/?tab=abandoned");
    cy.wait(1000);
    cy.assertListLengthByTestId("record-title-legacy", 20);
  });
});

describe("Given 1 under-review proposal", () => {
  it("should render loading placeholders only once", () => {
    cy.ticketvoteMiddleware("inventory", { amountByStatus: { started: 1 } });
    cy.recordsMiddleware("records", { status: 2, state: 2 });
    cy.visit("/?tab=under-review");
    cy.get("[data-testid='loading-placeholders'] > div", {
      timeout: 1200
    }).should("have.length", 5);
    cy.wait("@records.records");
    cy.get("[data-testid='record-title']").then(() => {
      cy.get("[data-testid='loading-placeholders'] > div", {
        timeout: 1
      }).should("not.exist");
    });
  });
});

describe("Big screens proposals list", () => {
  beforeEach(() => {
    cy.viewport(1500, 1500);
    cy.recordsMiddleware("records", { status: 2, state: 2 });
  });
  it("can render under review records with 5 autorized tokens", () => {
    // setup
    cy.ticketvoteMiddleware("inventory", {
      amountByStatus: { authorized: 5, started: 0, unauthorized: 13 }
    });
  });
  it("can render under review records with 5 started tokens", () => {
    cy.ticketvoteMiddleware("inventory", {
      amountByStatus: { authorized: 0, started: 5, unauthorized: 13 }
    });
  });
  it("can render under review records with 5 tokens started and authorized", () => {
    cy.ticketvoteMiddleware("inventory", {
      amountByStatus: { authorized: 5, started: 5, unauthorized: 13 }
    });
  });
  it("can render 10 authorized proposals", () => {
    cy.ticketvoteMiddleware("inventory", {
      amountByStatus: { authorized: 10, started: 0, unauthorized: 13 }
    });
  });
  afterEach(() => {
    cy.visit("/");
    cy.wait("@ticketvote.inventory");
    // Should trigger at least 2 records batch requests
    cy.wait("@records.records");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 10);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 15);
  });
});

describe("Admin proposals list", () => {
  beforeEach(() => {
    cy.userEnvironment("admin");
    cy.recordsMiddleware("inventory", {
      amountByStatus: { unreviewed: 22, censored: 8 }
    });
  });
  it("can render records list according to inventory order", () => {
    let inventory;
    cy.visit("/admin/records");
    cy.wait("@records.inventory").then(({ response: { body } }) => {
      inventory = body.unvetted;
    });
    cy.wait("@records.records");
    // first records batch
    cy.assertListLengthByTestId("record-title", RECORDS_PAGE_SIZE).each(
      ([{ id }], position) => {
        const tokens = getTokensByStatusTab(inventory, "Unreviewed");
        const expectedToken = shortRecordToken(tokens[position]);
        expect(id).to.have.string(expectedToken);
      }
    );
  });
  it("can render records and inventory pagination correctly", () => {
    cy.recordsMiddleware("records", { status: 1, state: 1 });
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
    // setup unreviewed record status
    cy.recordsMiddleware("records", { status: 1, state: 1 });
    cy.visit("/admin/records?tab=unreviewed");
    cy.wait("@records.inventory");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 5);
    // setup censored record status
    cy.recordsMiddleware("records", { status: 3, state: 1 });
    cy.findByTestId("tab-1").click();
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 5);
    // setup back to unreviewed
    cy.recordsMiddleware("records", { status: 1, state: 1 });
    cy.findByTestId("tab-0").click();
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 10);
  });
});

describe("Given some previously loaded approved proposals", () => {
  beforeEach(() => {
    cy.userEnvironment("noLogin");
    cy.ticketvoteMiddleware("inventory", { amountByStatus: { approved: 25 } });
    cy.piMiddleware("billingstatuschanges", {
      amountByStatus: { 3: 5 },
      billingChangesAmount: 0
    });
    cy.recordsMiddleware("records", { status: 2, state: 2 });
    cy.intercept("/api/v1/login", (req) => {
      req.reply({});
    });
    cy.ticketvoteMiddleware("summaries", { amountByStatus: { approved: 5 } });
  });
  it(
    "should fetch the billing changes after admin login",
    { scrollBehavior: false },
    () => {
      cy.visit("/?tab=approved");
      cy.wait("@ticketvote.inventory");
      cy.wait("@ticketvote.summaries");
      cy.wait("@records.records");
      cy.findByTestId("nav-login").click();
      cy.userEnvironment("admin");
      cy.findByLabelText(/email/i).type("email@email.com");
      cy.findByLabelText(/password/i).type("123123123");
      cy.ticketvoteMiddleware("inventory", {
        amountByStatus: { unauthorized: 5 }
      });
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { unauthorized: 5 }
      });
      cy.findByTestId("login-form-button").click();
      cy.wait("@ticketvote.inventory");
      cy.wait("@ticketvote.summaries");
      cy.wait("@records.records");
      cy.ticketvoteMiddleware("summaries", { amountByStatus: { approved: 5 } });
      cy.findByTestId("tab-1").click();
      cy.wait("@ticketvote.summaries");
      cy.wait("@records.records");
      cy.wait("@pi.billingstatuschanges");
      cy.wait("@pi.billingstatuschanges");
      cy.get("@pi.billingstatuschanges.all").should("have.length", 2);
      cy.get("@ticketvote.inventory.all").should("have.length", 2);
      cy.get("@records.records.all").should("have.length", 3);
      cy.get("@ticketvote.summaries.all").should("have.length", 3);
    }
  );
  it("should fetch paginated billing status after admin login", () => {
    cy.visit("/?tab=approved");
    // fetch 20 approved proposals
    cy.wait("@ticketvote.summaries");
    cy.wait("@comments.count");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 5);
    cy.scrollTo("bottom");
    cy.wait("@ticketvote.summaries");
    cy.wait("@comments.count");
    cy.wait("@records.records");
    cy.assertListLengthByTestId("record-title", 10);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.wait("@ticketvote.summaries");
    cy.wait("@comments.count");
    cy.assertListLengthByTestId("record-title", 15);
    cy.scrollTo("bottom");
    cy.wait("@records.records");
    cy.wait("@ticketvote.summaries");
    cy.wait("@comments.count");
    cy.assertListLengthByTestId("record-title", 20);
    // login as admin
    cy.findByTestId("nav-login").click();
    cy.userEnvironment("admin");
    cy.findByLabelText(/email/i).type("email@email.com");
    cy.findByLabelText(/password/i).type("123123123");
    cy.ticketvoteMiddleware("inventory", {
      amountByStatus: { unauthorized: 5 }
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 5 }
    });
    // back to under review tab
    cy.findByTestId("login-form-button").click();
    cy.wait("@records.records");
    cy.wait("@ticketvote.summaries");
    cy.wait(1000);
    // navigate to approved tab, now logged in as admin
    cy.findByTestId("tab-1").click();
    cy.wait(5000);
    cy.wait("@pi.billingstatuschanges");
    cy.wait("@pi.billingstatuschanges");
    cy.wait("@pi.billingstatuschanges");
    cy.wait("@pi.billingstatuschanges");
    cy.get("@pi.billingstatuschanges.all").should("have.length", 4);
  });
});

describe("Given an empty proposals list", () => {
  it("should render loading placeholders properly", () => {
    cy.ticketvoteMiddleware("inventory", {});
    cy.visit("/");
    cy.get("[data-testid='loading-placeholders'] > div", {
      timeout: 100
    }).should("have.length", 5);
    cy.findByTestId("help-message", { timeout: 1250 })
      .should("be.visible")
      .then(() => {
        cy.get("[data-testid='loading-placeholders'] > div", {
          timeout: 1
        }).should("not.exist");
      });
  });
  it("should switch tabs and show empty message", () => {
    // Test
    cy.visit("/");
    cy.wait("@ticketvote.inventory");
    cy.findByTestId("help-message").should("be.visible");
    cy.scrollTo("bottom");
    // switch to another tab
    cy.findByTestId("tab-1").click();
    // assert empty list
    cy.assertListLengthByTestId("record-title", 0);
    // back to Under Review tab
    cy.findByTestId("tab-0").click();
    // wait to see if no requests are done, since inventory is fully fetched
    cy.wait(1000);
    cy.findByTestId("help-message").should("be.visible");
  });
});

describe("Additional page content", () => {
  it("should load sidebar according to screen resolution", () => {
    cy.ticketvoteMiddleware("inventory");
    cy.visit("/");
    cy.findByTestId("sidebar").should("be.visible");
    cy.viewport("iphone-6");
    cy.findByTestId("sidebar").should("be.hidden");
    // sidebar breakpoint
    cy.viewport(1000, 500);
    cy.findByTestId("sidebar").should("be.hidden");
    cy.viewport(1001, 500);
    cy.findByTestId("sidebar").should("be.visible");
  });
});
