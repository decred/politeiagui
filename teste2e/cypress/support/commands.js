// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("assertHome", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add("assertProposalPage", (proposal) => {
  cy.findByText(proposal.name, { timeout: 15000 }).should("exist");
  cy.url().should(
    "eq",
    `${Cypress.config().baseUrl}/proposals/${proposal.token.substring(0, 7)}`
  );
});

Cypress.Commands.add("assertLoggedInAs", (user) => {
  cy.getCookies()
    .should("have.length", 2)
    .then((cookies) => {
      expect(cookies[1]).to.have.property("name", "session");
    });
  cy.findByTestId("trigger").should("have.text", user.username);
});

// TODO: add login using cy.request()
Cypress.Commands.add("typeLogin", (user) => {
  cy.visit("/user/login");
  cy.findByLabelText(/email/i).type(user.email);
  cy.findByLabelText(/password/i).type(user.password);
  cy.findByRole("button", { text: /login/i }).click();
  cy.assertHome();
  cy.assertLoggedInAs(user);
});

Cypress.Commands.add("logout", (user) => {
  cy.server();
  cy.route("POST", "api/v1/logout").as("logout");
  cy.assertLoggedInAs(user);
  cy.findByTestId("trigger").should("have.text", user.username).click();
  cy.findByText(/logout/i).click();
  cy.findByTestId("logout-btn").click();
  cy.wait("@logout").its("status").should("eq", 200);
  cy.findByTestId("trigger").should("not.have.text", user.username);
});

// Should use after login
// TODO: add identity using cy.request()
Cypress.Commands.add("typeIdentity", () => {
  cy.server();
  cy.route("GET", "api/v1/user/*").as("getUser");
  cy.route("POST", "api/v1/user/key").as("newKey");
  cy.route("POST", "api/v1/user/key/verify").as("keyVerify");
  cy.findByTestId("trigger").click();
  cy.findByText(/account/i).click();
  cy.wait("@getUser").its("status").should("eq", 200);
  cy.findByText(/create new identity/i, { timeout: 10000 }).click();
  cy.findByText(/confirm/i).click();
  cy.wait("@newKey").should((xhr) => {
    expect(xhr.status).to.equal(200);
    expect(xhr.response.body)
      .to.have.property("verificationtoken")
      .and.be.a("string");
    cy.visit(
      `/user/key/verify?verificationtoken=${xhr.response.body.verificationtoken}`
    );
    cy.wait("@keyVerify").its("status").should("eq", 200);
    cy.findByText(/go to proposals/i).click();
  });
});

// TODO: add createProposal using cy.request()
Cypress.Commands.add("typeCreateProposal", (proposal) => {
  cy.server();
  cy.findByText(/new proposal/i).click();
  cy.findByTestId("proposal-name", { timeout: 15000 }).type(proposal.name);
  cy.findByTestId("text-area").type(proposal.description);
  cy.route("POST", "/api/v1/proposals/new").as("newProposal");
  cy.findByText(/submit/i).click();
  // needs more time in general to complete this request so we increase the responseTimeout
  cy.wait("@newProposal", { timeout: 10000 }).should((xhr) => {
    expect(xhr.status).to.equal(200);
    expect(xhr.response.body)
      .to.have.property("censorshiprecord")
      .and.be.a("object")
      .and.have.all.keys("token", "signature", "merkle");
    cy.assertProposalPage({
      ...proposal,
      token: xhr.response.body.censorshiprecord.token
    });
  });
});

Cypress.on("window:before:load", (win) => {
  // this lets React DevTools "see" components inside application's iframe
  win.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
    window.top.__REACT_DEVTOOLS_GLOBAL_HOOK__;
});
