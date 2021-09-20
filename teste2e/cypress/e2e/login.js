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
    cy.findByTestId("close").click();
    cy.userLogout(unpaidUser.username);
    cy.wait(10000);
  });
});
