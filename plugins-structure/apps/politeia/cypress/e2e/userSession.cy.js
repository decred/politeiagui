describe("Given Login page", () => {
  beforeEach(() => {
    cy.visit("/user/login");
  });
  it("should render all elements correctly", () => {
    // Form elements visible
    cy.findByTestId("record-form")
      .should("be.visible")
      .and("include.text", "Log In");
    cy.get("#email").should("be.visible");
    cy.get("#pass").should("be.visible");
    // Render signup and resend verification email links
    cy.findByTestId("login-signup-link").should("be.visible");
    cy.findByTestId("login-reset-password-link").should("be.visible");
  });
  it("should be able to login", () => {
    cy.get("#email").type("email@email.com");
    cy.get("#pass").type("password");
    cy.findByTestId("login-form-button").should("be.enabled");
  });
});

describe("Given Signup page", () => {
  beforeEach(() => {
    cy.visit("/user/signup");
  });
  it("should render all elements correctly", () => {
    // Form elements visible
    cy.findByTestId("record-form")
      .should("be.visible")
      .and("include.text", "Create a new account");
    cy.get("#email").should("be.visible");
    cy.get("#username").should("be.visible");
    cy.get("#pass").should("be.visible");
    cy.get("#vpass").should("be.visible");
  });
  it("should be able to signup", () => {
    const email = "email@email.com";
    cy.get("#email").type(email);
    cy.get("#username").type("username");
    cy.get("#pass").type("password");
    cy.get("#vpass").type("password");
    cy.findByTestId("signup-form-button").should("be.enabled").click();
    cy.findByTestId("before-signup-modal").should("be.visible");
    cy.findByTestId("modal-confirm-submit-button").click();
    cy.findByTestId("modal-confirm-success-message").should(
      "include.text",
      email
    );
  });
});

describe("Given Reset Password Request page", () => {
  beforeEach(() => {
    cy.visit("user/password/request");
  });
  it("should render password reset request form correctly", () => {
    // Form elements visible
    cy.findByTestId("record-form")
      .should("be.visible")
      .and("include.text", "Request Password Reset");
    cy.get("#email").should("be.visible");
    cy.get("#username").should("be.visible");
  });
  it("should be able to reset password", () => {
    const email = "email@email.com";
    cy.get("#email").type(email);
    cy.get("#username").type("username");
    cy.findByTestId("password-reset-form-request-button").click();
    cy.findByTestId("verify-email-card").should("be.visible");
  });
});

describe("Given Reset Password page", () => {
  beforeEach(() => {
    cy.visit("/user/password/reset");
  });
  it("should render password reset request form correctly", () => {
    // Form elements visible
    cy.findByTestId("record-form")
      .should("be.visible")
      .and("include.text", "Reset Password");
    cy.get("#pass").should("be.visible");
    cy.get("#vpass").should("be.visible");
  });
  it("should be able to reset password", () => {
    cy.get("#pass").type("password");
    cy.get("#vpass").type("password");
    cy.findByTestId("password-reset-form-button").click();
  });
});
