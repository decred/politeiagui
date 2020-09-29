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

Cypress.Commands.add("assertLoggedInAs", (user) => {
  cy.getCookies()
    .should("have.length", 2)
    .then((cookies) => {
      expect(cookies[1]).to.have.property("name", "session");
    });
  cy.findByTestId("user-dropdown").should("have.text", user.username);
});

// TODO: add login using cy.request()
Cypress.Commands.add("typeLogin", (user) => {
  cy.findByText(/log in/i, { timeout: 10000 }).click();
  cy.findByLabelText(/email/i).type(user.email);
  cy.findByLabelText(/password/i).type(user.password);
  cy.findByRole("button", { text: /login/i }).click();
  cy.assertHome();
  cy.assertLoggedInAs(user);
});

// Should use after login
// TODO: add identity using cy.request()
Cypress.Commands.add("typeIdentity", () => {
  cy.findByTestId("user-dropdown").click();
  cy.findByText(/account/i).click();
  cy.findByText(/create new identity/i, { timeout: 20000 }).click();
  cy.findByText(/confirm/i).click();
  cy.findByText(/ok/i, { timeout: 20000 }).click();
  cy.findByText(/auto verify/i).click();
  cy.findByText(/go to proposals/i, { timeout: 10000 }).click();
});

// TODO: add createProposal using cy.request()
Cypress.Commands.add("typeCreateProposal", (proposal) => {
  cy.findByText(/new proposal/i).click();
  cy.findByTestId("proposal name", { timeout: 10000 }).type(proposal.name);
  cy.findByTestId("text-area").type(proposal.description);
  cy.findByText(/submit/i).click();
});
