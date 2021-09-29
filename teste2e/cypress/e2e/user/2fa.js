const user = {
  username: "user1",
  email: "user1@example.com",
  password: "password"
};

describe("Two-Factor Authentication", () => {
  beforeEach(() => {
    cy.login(user);
    cy.identity();
    cy.visit("/");
    // navigate to account page
    cy.get("[data-testid='header-nav']").findByText(user.username).click();
    cy.get("[data-testid='header-nav']")
      .findByText(/account/i)
      .click();
    // navigate to 2fa section
    cy.findByText(/two-factor authentication/i).click();
  });
  it("should set and reset the 2fa code successfully", () => {
    cy.middleware("users.verifytotp");
    cy.middleware("users.totp");
    // set 2fa
    cy.findByTestId("totp-set-wrapper").should("be.visible");
    cy.findByTestId("digits-input").type("123456");
    cy.findByTestId("totp-verify-button").click();
    cy.findByTestId("modal-confirm-button").click();
    cy.wait("@users.verifytotp");
    cy.findByTestId("modal-confirm-success-msg").click();
    // reset 2fa
    cy.wait(1000);
    cy.findByTestId("digits-input").type("123456");
    cy.findByTestId("totp-verify-button").click();
    cy.findByTestId("modal-confirm-button").click();
    cy.findByTestId("modal-confirm-success-msg").click();
  });
  it("should display error when setting up an invalid 2fa code", () => {
    cy.middleware("users.verifytotp", { error: true });
    cy.middleware("users.totp");
    // set 2fa with errors
    cy.findByTestId("totp-set-wrapper").should("be.visible");
    cy.findByTestId("digits-input").type("654321");
    cy.findByTestId("totp-verify-button").click();
    cy.findByTestId("modal-confirm-button").click();
    cy.findByTestId("modal-confirm-error").should("be.visible");
    cy.findByTestId("close").click();
  });
});
