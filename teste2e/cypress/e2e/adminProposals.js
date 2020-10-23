import { buildProposal } from "../support/generate";

describe("Admin proposals actions", () => {
  it("Can approve proposals", () => {
    // paid admin user with proposal credits
    cy.server();
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.typeLogin(user);
    cy.typeIdentity();
    const proposal = buildProposal();
    cy.typeCreateProposal(proposal);
    cy.route("POST", "/api/v1/proposals/batchvotesummary").as("unvettedLoaded");
    cy.visit("/proposals/unvetted");
    cy.wait("@unvettedLoaded");
    cy.findByText(proposal.name).click();
    cy.findByText(/approve/i).click();
    cy.route("POST", "/api/v1/proposals/**/status").as("confirm");
    cy.findByText(/confirm/i).click();
    cy.wait("@confirm");
    cy.findByText(/ok/i).click();
    cy.findByText(/Waiting for author/i).should("exist");
  });

  it("Can report a proposal as a spam", () => {
    // paid admin user with proposal credits
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal(proposal);
    cy.route("POST", "/api/v1/proposals/batchvotesummary").as("unvettedLoaded");
    cy.visit("/proposals/unvetted");
    cy.wait("@unvettedLoaded");
    cy.findByText(proposal.name).click();
    cy.findByText(/report/i).click();
    cy.findByLabelText(/censor reason/i).type("censor!");
    cy.route("POST", "/api/v1/proposals/**/status").as("confirm");
    cy.findByText(/confirm/i).click();
    cy.wait("@confirm");
    cy.findByText(/ok/i).click();
    cy.findByText(/approve/i).should("not.exist");
    cy.route("POST", "/api/v1/proposals/batchvotesummary").as("unvettedLoaded");
    cy.visit("/proposals/unvetted?tab=censored");
    cy.wait("@unvettedLoaded");
    cy.findByText(proposal.name).should("exist");
  });

  it("Can abandon a proposal", () => {
    // paid admin user with proposal credits
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal(proposal);
    cy.route("POST", "/api/v1/proposals/batchvotesummary").as("unvettedLoaded");
    cy.visit("/proposals/unvetted");
    cy.wait("@unvettedLoaded");
    cy.findByText(proposal.name).click();
    cy.findByText(/approve/i).click();
    cy.route("POST", "/api/v1/proposals/**/status").as("confirm");
    cy.findByText(/confirm/i).click();
    cy.wait("@confirm");
    cy.findByText(/ok/i).click();
    cy.findByText(/waiting for author/i).should("exist");
    cy.findByText(/abandon/i).click();
    cy.findByLabelText(/abandon reason/i).type("abandon!");
    cy.route("POST", "/api/v1/proposals/**/status").as("confirm");
    cy.findByText(/confirm/i).click();
    cy.wait("@confirm");
    cy.findByText(/ok/i).click();
    cy.findAllByText(/abandoned/).should("exist");
  });

  it("Can authorize voting", () => {
    // paid admin user with proposal credits
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal(proposal);
    cy.route("POST", "/api/v1/proposals/batchvotesummary").as("unvettedLoaded");
    cy.visit("/proposals/unvetted");
    cy.wait("@unvettedLoaded");
    cy.findByText(proposal.name).click();
    cy.findByText(/approve/i).click();
    cy.route("POST", "/api/v1/proposals/**/status").as("confirm");
    cy.findByText(/confirm/i).click();
    cy.wait("@confirm");
    cy.findByText(/ok/i).click();
    cy.findByText(/Waiting for author/i).should("exist");
    cy.findByRole("button", { name: /authorize voting/i }).click();
    cy.route("POST", "/api/v1/proposals/authorizevote").as(
      "confirmAuthorizeVote"
    );
    cy.findByText(/confirm/i).click();
    cy.wait("@confirmAuthorizeVote");
    cy.findByTestId("close-confirm-msg").click();
  });
});
