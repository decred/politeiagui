import { buildProposal } from "../support/generate";

describe("Admin proposals actions", () => {
  it("Can approve proposals", () => {
    cy.visit("/");
    // paid admin user with proposal credits
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    const proposal = buildProposal();
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal(proposal);
    // TODO: Remove
    cy.wait(2000);
    // cy.findByTestId("proposal-title", { timeout: 20000 }).should(
    //   "have.text",
    //   proposal.name
    // );
    cy.visit("/proposals/unvetted");
    cy.findByText(proposal.name, { timeout: 20000 }).click();
    cy.findByText(/approve/i).click();
    cy.findByText(/confirm/i).click();
    cy.findByText(/ok/i, { timeout: 10000 }).click();
    cy.findByText(/Waiting for author/i).should("exist");
  });

  it("Can report a proposal as a spam", () => {
    cy.visit("/");
    // paid admin user with proposal credits
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    const proposal = buildProposal();
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal(proposal);
    // TODO: Remove
    cy.wait(2000);
    cy.visit("/proposals/unvetted");
    cy.findByText(proposal.name, { timeout: 20000 }).click();
    cy.findByText(/report/i).click();
    cy.findByLabelText(/censor reason/i).type("censor!");
    cy.findByText(/confirm/i).click();
    cy.findByText(/ok/i, { timeout: 10000 }).click();
    cy.findByText(/approve/i).should("not.exist");

    cy.visit("/proposals/unvetted?tab=censored");
    cy.findByText(proposal.name, { timeout: 10000 }).should("exist");
  });

  it("Can abandon a proposal", () => {
    cy.visit("/");
    // paid admin user with proposal credits
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    const proposal = buildProposal();
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal(proposal);
    // TODO: Remove
    cy.wait(2000);
    cy.visit("/proposals/unvetted");
    cy.findByText(proposal.name, { timeout: 20000 }).click();
    cy.findByText(/approve/i).click();
    cy.findByText(/confirm/i).click();
    cy.findByText(/ok/i, { timeout: 10000 }).click();
    cy.findByText(/waiting for author/i).should("exist");
    cy.findByText(/abandon/i).click();
    cy.findByLabelText(/abandon reason/i).type("abandon!");
    cy.findByText(/confirm/i).click();
    cy.findByText(/ok/i, { timeout: 20000 }).click();
    cy.findAllByText(/abandoned/).should("exist");
  });

  it("Can authorize voting", () => {
    cy.visit("/");
    // paid admin user with proposal credits
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    const proposal = buildProposal();
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal(proposal);
    // TODO: Remove
    cy.wait(2000);
    cy.visit("/proposals/unvetted");
    cy.findByText(proposal.name, { timeout: 20000 }).click();
    cy.findByText(/approve/i).click();
    cy.findByText(/confirm/i).click();
    cy.findByText(/ok/i, { timeout: 10000 }).click();
    cy.findByText(/Waiting for author/i).should("exist");
    cy.findByRole("button", { name: /authorize voting/i }).click();
    cy.findByText(/confirm/i).click();
    cy.findByText(/ok/i, { timeout: 10000 }).click();
  });

  // it.only("Test XHR", () => {
  //   cy.server();
  //   // cy.route("GET", "/api").as("api");

  //   cy.visit("/");

  //   cy.route("GET", "https://localhost:3000/").as("api");

  //   // cy.wait("@api").then(console.log);
  //   cy.wait("@api");
  // });
});
