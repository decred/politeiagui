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
import { sha3_256 } from "js-sha3";
import { requestWithCsrfToken, setProposalStatus } from "../utils";
import * as pki from "../pki";
// TODO: consider moving general functions like makeProposal and signRegister to a more general lib file other than api
import { makeProposal, signRegister } from "../utils";

Cypress.Commands.add("assertHome", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add("assertProposalPage", (proposal) => {
  cy.findByText(proposal.name, { timeout: 20000 }).should("be.visible");
  cy.url().should(
    "eq",
    `${Cypress.config().baseUrl}/record/${proposal.token.substring(0, 7)}`
  );
});

Cypress.Commands.add("assertLoggedInAs", () => {
  cy.getCookies()
    .should("have.length", 2)
    .then((cookies) => {
      expect(cookies[1]).to.have.property("name", "session");
    });
});

Cypress.Commands.add("typeLogin", (user) => {
  cy.visit("/user/login");
  cy.findByLabelText(/email/i).type(user.email);
  cy.findByLabelText(/password/i).type(user.password);
  cy.findByRole("button", { text: /login/i }).click();
  cy.assertHome();
  cy.assertLoggedInAs();
});

Cypress.Commands.add("login", (user) => {
  requestWithCsrfToken("api/v1/login", {
    email: user.email,
    password: sha3_256(user.password)
  });
});

Cypress.Commands.add("register", (user) => {
  requestWithCsrfToken("api/v1/user/new", {
    email: user.email,
    password: sha3_256(user.password),
    username: user.username,
    publickey: user.publickey
  });
});

Cypress.Commands.add("logout", () => {
  requestWithCsrfToken("api/v1/logout");
});

// Should use after login
Cypress.Commands.add("identity", () => {
  cy.server();
  cy.route("POST", "api/v1/user/key/verify").as("verifyKey");
  cy.request("api/v1/user/me").then((res) => {
    return pki.generateKeys().then((keys) => {
      return pki.loadKeys(res.body.userid, keys).then(() => {
        requestWithCsrfToken("api/v1/user/key", {
          publickey: pki.toHex(keys.publicKey)
        }).then((res) => {
          cy.visit(
            `/user/key/verify?verificationtoken=${res.body.verificationtoken}`
          );
          cy.wait("@verifyKey").its("status").should("eq", 200);
        });
      });
    });
  });
});

Cypress.Commands.add("createProposal", (proposal) => {
  const createdProposal = makeProposal(proposal.name, proposal.description);
  return cy
    .request("api/v1/user/me")
    .then((res) =>
      signRegister(res.body.userid, createdProposal).then((res) =>
        requestWithCsrfToken("/api/records/v1/new", res)
      )
    );
});

Cypress.Commands.add("approveProposal", ({ token }) =>
  setProposalStatus(token, 2, 1, "")
);

Cypress.Commands.add("typeCreateProposal", (proposal) => {
  cy.server();
  cy.findByTestId("proposal-name").type(proposal.name);
  cy.findByTestId("text-area").type(proposal.description);
  cy.route("POST", "/api/records/v1/new").as("newProposal");
  cy.findByText(/submit/i).click();
  // needs more time in general to complete this request so we increase the
  // responseTimeout
  cy.wait("@newProposal", { timeout: 10000 }).should((xhr) => {
    expect(xhr.status).to.equal(200);
    expect(xhr.response.body.record)
      .to.have.property("censorshiprecord")
      .and.be.a("object")
      .and.have.all.keys("token", "signature", "merkle");
    cy.assertProposalPage({
      ...proposal,
      token: xhr.response.body.record.censorshiprecord.token
    });
  });
});

Cypress.on("window:before:load", (win) => {
  // this lets React DevTools "see" components inside application's iframe
  win.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
    window.top.__REACT_DEVTOOLS_GLOBAL_HOOK__;
});
