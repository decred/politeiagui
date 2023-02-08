import {
  mockApi,
  mockUser,
  mockUserDetails,
} from "@politeiagui/core/dev/mocks";

describe("Given regular user is logged in", () => {
  const currentid = "regular-user-id";
  const otherid = "other-user-id";
  beforeEach(() => {
    cy.mockResponse("/api", mockApi({ activeusersession: true }));
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
  });
  describe("when opening the header menu", () => {
    beforeEach(() => {
      cy.mockResponse(
        "/api/v1/user/" + currentid,
        mockUserDetails({ id: currentid })
      );
      // Make screen bigger so the menu doesn't get hidden
      cy.viewport(1200, 1200);
    });
    it("should display the correct menu items", () => {
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
});
