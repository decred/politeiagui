const unpaidUser = {
  email: "user3@example.com",
  username: "user3",
  password: "password"
};

const adminUser = {
  email: "adminuser@example.com",
  username: "adminuser",
  password: "password"
};

describe("Login", () => {
  it("Can login", () => {
    cy.typeLogin(adminUser);
  });
  it("Can login with an unpaid user", () => {
    cy.typeLogin(unpaidUser);
    cy.findByTestId("registration-fee-btn").should("be.visible");
  });
  it("Can logout with a paid user", () => {
    cy.typeLogin(adminUser);
    cy.userLogout(adminUser.username);
  });
  it("Can logout with an unpaid user", () => {
    cy.typeLogin(unpaidUser);
    cy.userLogout(unpaidUser.username);
    // wait to see if any payment requests are triggered
    cy.wait(10000);
    cy.findByTestId("header-nav").should("not.exist");
  });
  it("Can logout with an unpaid user on payment screen", () => {
    cy.typeLogin(unpaidUser);
    cy.findByTestId("registration-fee-btn").click();
    cy.findByTestId(/close/i).click();
    cy.userLogout(unpaidUser.username);
    cy.wait(10000);
  });
});

describe("2FA Login", () => {
  it("should display the 2FA modal when user totp is active", () => {
    cy.middleware("users.login", { error: { statusCode: 401, errorCode: 79 } });
    cy.visit("/user/login");
    cy.findByLabelText(/email/i).type(unpaidUser.email);
    cy.findByLabelText(/password/i).type(unpaidUser.password);
    cy.findByTestId("login-form-button").click();
    cy.findByText(/authenticator code/i);
    cy.middleware("users.login");
    cy.findByTestId("digits-input").type("123456");
    cy.get("[data-testid='header-nav']")
      .findByText(unpaidUser.username)
      .should("be.visible");
  });
  it("should display errors when 2FA code is invalid", () => {
    cy.middleware("users.login", { error: { statusCode: 401, errorCode: 79 } });
    cy.visit("/user/login");
    cy.findByLabelText(/email/i).type(unpaidUser.email);
    cy.findByLabelText(/password/i).type(unpaidUser.password);
    cy.findByTestId("login-form-button").click();
    cy.findByText(/authenticator code/i);
    cy.middleware("users.login", { error: { statusCode: 401, errorCode: 77 } });
    cy.findByTestId("digits-input").type("123456");
    cy.findByTestId("modal-totp-verify-error").should("be.visible");
  });
});
