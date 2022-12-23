const tabs = [
  "Identity",
  "Account",
  "Preferences",
  "Credits",
  "Submitted Proposals",
  "Draft Proposals",
  "Two-Factor Authentication",
];
const user = {
  userid: "user-test-id",
  email: "admin@example.com",
  username: "admin",
};

describe("Given User Details page", () => {
  beforeEach(() => {
    cy.visit(`/user/${user.userid}`);
  });
  it("should redirect to identity page", () => {
    cy.findByTestId("user-identity-manage").should("be.visible");
  });
  it("should render all user details tabs", () => {
    cy.wrap(tabs).each((tab, i) => {
      cy.findByTestId(`tab-${i}`).should("have.text", tab);
    });
  });
  it("should render username and email on banner", () => {
    cy.findByTestId("tabs-banner-header").should("include.text", user.username);
    cy.findByTestId("tabs-banner-header").should("include.text", user.email);
  });
});

describe("Given User Identity tab", () => {
  beforeEach(() => {
    cy.visit(`/user/${user.userid}/identity`);
  });
  it("should render identity cards", () => {
    cy.findByTestId("user-identity-manage").should(
      "include.text",
      "Manage Identity"
    );
    cy.findByTestId("user-identity-active-pubkey").should(
      "include.text",
      "Active Public Key"
    );
    cy.findByTestId("user-identity-past-pubkeys").should(
      "include.text",
      "Past Public Keys"
    );
    cy.findByTestId("user-identity-userid").should("include.text", "User ID");
  });
  it("should display create new identity modal", () => {
    cy.findByTestId("user-identity-manage")
      .findByText("Create new Identity")
      .click();
    cy.findByTestId("identity-create-modal").should("be.visible");
  });
  it("should display import identity modal", () => {
    cy.findByTestId("user-identity-manage")
      .findByText("Import Identity")
      .click();
    cy.findByTestId("identity-import-modal").should("be.visible");
  });
  it("should display past pubkeys modal", () => {
    cy.findByTestId("user-identity-past-pubkeys")
      .findByText("Show All")
      .click();
    cy.findByTestId("identity-inactive-pubkeys-modal").should("be.visible");
  });
});

describe("Given User Account tab", () => {
  beforeEach(() => {
    cy.visit(`/user/${user.userid}/account`);
  });
  it("should display account cards", () => {
    cy.findByTestId("user-account-details").should(
      "include.text",
      "Account Details"
    );
    cy.findByTestId("user-account-paywall").should("include.text", "Paywall");
    cy.findByTestId("user-account-security").should("include.text", "Security");
  });
  it("should display change username modal", () => {
    cy.findByTestId("user-account-username-edit-button").click();
    cy.findByTestId("account-username-change-modal").should("be.visible");
  });
  it("should display change password modal", () => {
    cy.findByTestId("user-account-details")
      .findByText("Change Password")
      .click();
    cy.findByTestId("account-password-change-modal").should("be.visible");
  });
  it("should display clear data modal", () => {
    cy.findByTestId("user-account-details").findByText("Clear Data").click();
    cy.findByTestId("account-clear-data-modal").should("be.visible");
  });
  it("should display deactivate account modal", () => {
    cy.findByTestId("user-account-security")
      .findByText("Deactivate Account")
      .click();
    cy.findByTestId("modal-confirm-message").should(
      "include.text",
      "You are about to deactivate your account"
    );
  });
});

describe("Given User Preferences tab", () => {
  beforeEach(() => {
    cy.visit(`/user/${user.userid}/preferences`);
  });
  it("should display preferences cards", () => {
    cy.findByTestId("user-preferences-my-proposals").should(
      "include.text",
      "Email notifications for my proposals"
    );
    cy.findByTestId("user-preferences-others-proposals").should(
      "include.text",
      "Email notifications for other's proposals"
    );
    cy.findByTestId("user-preferences-comments").should(
      "include.text",
      "Email notifications for comments"
    );
    cy.findByTestId("user-preferences-admin").should(
      "include.text",
      "Admin email notifications"
    );
    cy.findByTestId("user-preferences-save-button").should("be.enabled");
  });
});

describe("Given User Credits tab", () => {
  beforeEach(() => {
    cy.visit(`/user/${user.userid}/credits`);
  });
  it("should display credits info cards", () => {
    cy.findByTestId("user-credits-balance-fee").should("be.visible");
    cy.findByTestId("user-credits-payments")
      .should("include.text", "Payments History")
      .get("table")
      .should("be.visible");
  });
  it("should render registration fee modal", () => {
    cy.findByTestId("user-credits-pay-fee-button").click();
    cy.findByTestId("registration-fee-modal").should("be.visible");
  });
  it("should render purchase credits modal", () => {
    cy.findByTestId("user-credits-purchase-button").click();
    cy.findByTestId("credits-modal")
      .should("be.visible")
      .get("#credits-input")
      .type(10);
    cy.findByTestId("payment-value").should("have.text", "1 DCR");
  });
  it("should rescan payments", () => {
    cy.findByTestId("user-credits-rescan-button").click();
    cy.findByTestId("common-ui-toast").should(
      "include.text",
      "Payments scan completed!"
    );
  });
});

describe("Given User Two-Factor Authentication tab", () => {
  beforeEach(() => {
    cy.visit(`/user/${user.userid}/2fa`);
  });
  it("should display 2FA cards on verify mode", () => {
    cy.findByTestId("user-2fa-set")
      .should("include.text", "Set Two-Factor Authentication")
      .get("img") // QR Code
      .should("be.visible");
    cy.findByTestId("user-2fa-backup").get("#totp-key").should("be.visible");
    cy.findByTestId("user-2fa-code").should("be.visible");
  });
});
