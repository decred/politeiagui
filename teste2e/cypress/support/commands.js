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
//
import { sha3_256 } from "js-sha3";
import {
  PROPOSAL_SUMMARY_STATUS_UNVETTED,
  requestWithCsrfToken,
  setProposalStatus
} from "../utils";
import * as pki from "../pki";
import get from "lodash/fp/get";
// TODO: consider moving general functions like makeProposal and signRegister
// to a more general lib file other than api.
import {
  makeProposal,
  signRegister,
  shortRecordToken,
  RECORD_DOMAINS,
  typeDatePicker
} from "../utils";
import { middlewares as recordMiddlewares } from "./mock/records";
import { middlewares as ticketVoteMiddlewares } from "./mock/ticketvote";
import { middlewares as commentsMiddlewares } from "./mock/comments";
import { middlewares as usersMiddlewares } from "./mock/users";
import { middlewares as piMiddlewares } from "./mock/pi";

Cypress.Commands.add("assertHome", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add("assertProposalPage", (proposal) => {
  cy.findAllByText(proposal.name, { timeout: 20000 }).should("be.visible");
  cy.url().should(
    "eq",
    `${Cypress.config().baseUrl}/record/${shortRecordToken(proposal.token)}`
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
  cy.findByTestId("login-form-button").click();
  cy.assertHome();
  cy.assertLoggedInAs();
});

Cypress.Commands.add("typeLoginModal", (user) => {
  cy.findByTestId("modal-login").should("be.visible");
  cy.findByLabelText(/email/i).type(user.email);
  cy.findByLabelText(/password/i).type(user.password);
  cy.findByTestId("login-form-button").click();
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

Cypress.Commands.add("userLogout", (username) => {
  cy.get("[data-testid='header-nav']").findByText(username).click();
  cy.get("[data-testid='header-nav']")
    .findByText(/logout/i)
    .click();
});

// Should use after login
Cypress.Commands.add("identity", () => {
  cy.server();
  cy.route("POST", "api/v1/user/key/verify").as("verifyKey");
  cy.request("api/v1/user/me").then((res) =>
    pki.generateKeys().then((keys) =>
      pki.loadKeys(res.body.userid, keys).then(() =>
        requestWithCsrfToken("api/v1/user/key", {
          publickey: pki.toHex(keys.publicKey)
        }).then((res) => {
          cy.visit(
            `/user/key/verify?verificationtoken=${res.body.verificationtoken}`
          );
          cy.wait("@verifyKey").its("status").should("eq", 200);
        })
      )
    )
  );
});

Cypress.Commands.add(
  "createProposal",
  ({ name, description, startDate, endDate, amount, domain }) => {
    const createdProposal = makeProposal({
      name,
      markdown: description,
      startdate: startDate,
      enddate: endDate,
      amount,
      domain
    });
    return cy
      .request("api/v1/user/me")
      .then((me) =>
        signRegister(me.body.userid, createdProposal).then((proposal) =>
          requestWithCsrfToken("/api/records/v1/new", proposal, false)
        )
      );
  }
);

Cypress.Commands.add("approveProposal", ({ token }) =>
  setProposalStatus(token, 2, 1, "")
);

Cypress.Commands.add("typeCreateProposal", (proposal) => {
  cy.server();
  cy.findByTestId("proposal-name").type(proposal.name);
  cy.findByTestId("proposal-amount").type(String(proposal.amount / 100)); // get dollars from cents.
  const startDate = new Date(proposal.startDate * 1000);
  cy.get("[data-testid=datepicker]:eq(0)")
    .children()
    .first()
    .as("startDate")
    .click();
  cy.get("[data-testid=days-list]:eq(0)")
    .find(`>li:eq(${startDate.getDate()})`)
    .click();
  cy.get("[data-testid=datepicker]:eq(1)")
    .children()
    .first()
    .as("startDate")
    .click();
  cy.get("[data-testid=days-list]:eq(1)").find(">li").last().click();
  const domainTxt = RECORD_DOMAINS[proposal.domain];
  cy.get("#domain-selector").click().contains(domainTxt).click({ force: true });
  cy.route("POST", "/api/records/v1/new").as("newProposal");
  cy.findByTestId("text-area").type(proposal.description);
  cy.findByRole("button", { name: /submit/i }).click();
  // needs more time in general to complete this request so we increase the
  // responseTimeout
  cy.wait("@newProposal", { timeout: 10000 }).should((xhr) => {
    expect(xhr.status).to.equal(200);
    expect(xhr.response.body.record)
      .to.have.property("censorshiprecord")
      .and.be.a("object")
      .and.have.all.keys("token", "signature", "merkle");
    const token = xhr.response.body.record.censorshiprecord.token;
    cy.middleware("pi.summaries", {
      token,
      status: PROPOSAL_SUMMARY_STATUS_UNVETTED
    });
    cy.assertProposalPage({
      ...proposal,
      token: token
    });
  });
});

Cypress.Commands.add("assertListLengthByTestId", (testid, expectedLength) =>
  cy.findAllByTestId(testid).should("have.length", expectedLength)
);

Cypress.Commands.add("middleware", (path, ...args) => {
  const mw = get(path)({
    ticketvote: ticketVoteMiddlewares,
    records: recordMiddlewares,
    comments: commentsMiddlewares,
    users: usersMiddlewares,
    pi: piMiddlewares
  });
  return mw(...args).as(path);
});

Cypress.Commands.add("shouldBeCalled", (alias, timesCalled) => {
  expect(
    cy.state("requests").filter((call) => call.alias === alias),
    `${alias} should have been called ${timesCalled} times`
  ).to.have.length(timesCalled);
});

Cypress.on("window:before:load", (win) => {
  // this lets React DevTools "see" components inside application's iframe
  win.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
    window.top.__REACT_DEVTOOLS_GLOBAL_HOOK__;
});
