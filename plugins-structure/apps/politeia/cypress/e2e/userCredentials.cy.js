import {
  mockApi,
  mockUser,
  mockUserDetails,
} from "@politeiagui/core/dev/mocks";
import { mockTicketvoteInventory } from "@politeiagui/ticketvote/dev/mocks";

beforeEach(() => {
  cy.mockResponse("/api/ticketvote/v1/inventory", mockTicketvoteInventory(0));
  cy.viewport(1200, 1200);
});

describe("Given regular user is logged in", () => {
  const currentid = "regular-user-id";
  const otherid = "other-user-id";
  beforeEach(() => {
    cy.mockResponse("/api", mockApi({ activeusersession: true }), {
      headers: {
        "X-Csrf-Token": "csrf-test-token",
      },
    });
    cy.mockResponse("/api/v1/user/me", mockUser({ userid: currentid }));
  });
  describe("When on user details page", () => {
    it("should only display Identity, Account and Proposals on others profile", () => {
      cy.mockResponse(
        "/api/v1/user/" + otherid,
        mockUserDetails({ id: otherid, email: "" })
      );
      cy.visit("/user/" + otherid);
      cy.findByTestId("tabs-banner-tabs")
        .should("contain.text", "Identity")
        .and("contain.text", "Account")
        .and("contain.text", "Submitted Proposals")
        .and("not.contain.text", "Preferences")
        .and("not.contain.text", "Credits")
        .and("not.contain.text", "Draft Proposals")
        .and("not.contain.text", "Two-Factor Authentication");
    });
    it("should display all tabs on current user profile", () => {
      cy.mockResponse(
        "/api/v1/user/" + currentid,
        mockUserDetails({ id: currentid })
      );
      cy.visit("/user/" + currentid);
      cy.findByTestId("tabs-banner-tabs")
        .should("contain.text", "Identity")
        .and("contain.text", "Account")
        .and("contain.text", "Preferences")
        .and("contain.text", "Credits")
        .and("contain.text", "Submitted Proposals")
        .and("contain.text", "Draft Proposals")
        .and("contain.text", "Two-Factor Authentication");
    });
    it("should redirect to user details identity page on User details page", () => {
      cy.mockResponse(
        "/api/v1/user/" + otherid,
        mockUserDetails({ id: otherid, email: "" })
      );
      cy.visit("/user/" + otherid);
      const tabs = ["credits", "drafts", "2fa", "preferences"];
      for (const tab of tabs) {
        cy.visit("/user/" + otherid + "/" + tab);
        cy.location("pathname").should("eq", "/user/" + otherid);
      }
    });
  });

  describe("when opening the header menu", () => {
    it("should display the correct menu items", () => {
      cy.mockResponse(
        "/api/v1/user/" + currentid,
        mockUserDetails({ id: currentid })
      );
      cy.visit("/user/" + currentid);
      cy.findByTestId("header-dropdown").click();
      cy.findByTestId("items-list").children().should("have.length", 5);
      cy.findByTestId("header-dropdown").should("contain.text", "Account");
      cy.findByTestId("header-dropdown").should(
        "contain.text",
        "All Proposals"
      );
      cy.findByTestId("header-dropdown").should("contain.text", "My Proposals");
      cy.findByTestId("header-dropdown").should("contain.text", "My Drafts");
      cy.findByTestId("header-dropdown").should("contain.text", "Logout");
    });
  });

  describe("when navigating to home page", () => {
    it("should display the New Proposal button", () => {
      cy.mockResponse(
        "/api/ticketvote/v1/inventory",
        mockTicketvoteInventory(0)
      );
      cy.visit("/");
      cy.findByTestId("banner-new-proposal-button").should("exist").click();
      cy.findByTestId("record-form").should("be.visible");
    });
  });
});

describe("Given a non-logged in user", () => {
  const userid = "other-user-id";
  beforeEach(() => {
    cy.mockResponse(
      "/api/v1/user/" + userid,
      mockUserDetails({ id: userid, email: "" })
    );
  });
  // Same behavior for regular user's view and non-logged in user's view
  describe("when on user details page", () => {
    it("should only display Identity, Account and Proposals on others profile", () => {
      cy.visit("/user/" + userid);
      cy.findByTestId("tabs-banner-tabs")
        .should("contain.text", "Identity")
        .and("contain.text", "Account")
        .and("contain.text", "Submitted Proposals")
        .and("not.contain.text", "Preferences")
        .and("not.contain.text", "Credits")
        .and("not.contain.text", "Draft Proposals")
        .and("not.contain.text", "Two-Factor Authentication");
    });
  });

  describe("when opening the header menu", () => {
    it("should not display dropdown button", () => {
      cy.visit("/");
      cy.findByTestId("header-dropdown").should("not.exist");
    });
  });

  describe("when navigating to home page", () => {
    it("should not display the New Proposal button", () => {
      cy.visit("/");
      cy.findByTestId("banner-new-proposal-button").should("not.exist");
      cy.findByTestId("login-header-link").should("be.visible");
      cy.findByTestId("signup-header-link").should("be.visible");
    });
  });

  describe("when navigating to auth-required pages", () => {
    it("should redirect to home page on Proposal New page", () => {
      cy.visit("/record/new");
      cy.location("pathname").should("eq", "/user/login");
    });
    it("should redirect to home page on Admin pages", () => {
      cy.visit("/admin/records");
      cy.location("pathname").should("eq", "/user/login");
    });
    it("should redirect to user details identity page on User details page", () => {
      const tabs = ["credits", "drafts", "2fa", "preferences"];
      for (const tab of tabs) {
        cy.visit("/user/" + userid + "/" + tab);
        cy.location("pathname").should("eq", "/user/" + userid);
      }
    });
  });
});

describe("Given a logged in admin user", () => {
  const currentid = "admin-user-id";
  const otherid = "other-user-id";
  beforeEach(() => {
    cy.mockResponse("/api", mockApi({ activeusersession: true }), {
      headers: {
        "X-Csrf-Token": "csrf-test-token",
      },
    });
    cy.mockResponse(
      "/api/v1/user/me",
      mockUser({ userid: currentid, isadmin: true })
    );
  });
  describe("When on user details page", () => {
    it("should display Identity, Account, Credits and Submitted Proposals tabs", () => {
      cy.mockResponse(
        "/api/v1/user/" + otherid,
        mockUserDetails({ id: otherid })
      );
      cy.visit("/user/" + otherid);
      cy.findByTestId("tabs-banner-tabs")
        .should("contain.text", "Identity")
        .and("contain.text", "Account")
        .and("contain.text", "Credits")
        .and("contain.text", "Submitted Proposals")
        .and("not.contain.text", "Preferences")
        .and("not.contain.text", "Draft Proposals")
        .and("not.contain.text", "Two-Factor Authentication");
    });

    it("should display all tabs on current user profile", () => {
      cy.mockResponse(
        "/api/v1/user/" + currentid,
        mockUserDetails({ id: currentid })
      );
      cy.visit("/user/" + currentid);
      cy.findByTestId("tabs-banner-tabs")
        .should("contain.text", "Identity")
        .and("contain.text", "Account")
        .and("contain.text", "Preferences")
        .and("contain.text", "Credits")
        .and("contain.text", "Submitted Proposals")
        .and("contain.text", "Draft Proposals")
        .and("contain.text", "Two-Factor Authentication");
    });

    it("should display the correct menu items", () => {
      // Make screen bigger so the menu doesn't get hidden
      cy.visit("/");
      cy.findByTestId("header-dropdown").click();
      cy.findByTestId("items-list").children().should("have.length", 7);
      cy.findByTestId("header-dropdown").should("contain.text", "Account");
      cy.findByTestId("header-dropdown").should(
        "contain.text",
        "All Proposals"
      );
      cy.findByTestId("header-dropdown").should("contain.text", "My Proposals");
      cy.findByTestId("header-dropdown").should("contain.text", "My Drafts");
      cy.findByTestId("header-dropdown").should("contain.text", "Logout");

      // Admin items
      cy.findByTestId("header-dropdown").should("contain.text", "Admin");
      cy.findByTestId("header-dropdown").should(
        "contain.text",
        "Search for Users"
      );
    });
  });
});
