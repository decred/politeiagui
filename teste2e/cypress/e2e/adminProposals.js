import { buildProposal } from "../support/generate";

describe("Admin proposals actions", () => {
  it("Can approve proposals", () => {
    // paid admin user with proposal credits
    cy.server();
    // create proposal
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(user);
    cy.identity();
    cy.createProposal(proposal).then(
      ({
        body: {
          record: {
            censorshiprecord: { token }
          }
        }
      }) => {
        cy.visit(`record/${token.substring(0, 7)}`);
        // Manually approve proposal
        cy.findByText(/approve/i).click();
        cy.route("POST", "/api/records/v1/setstatus").as("confirm");
        cy.findByText(/confirm/i).click();
        cy.wait("@confirm");
        cy.findByText(/ok/i).click();
        cy.findByText(/waiting for author/i).should("be.visible");
      }
    );
  });

  it("Can report a proposal as a spam", () => {
    // paid admin user with proposal credits
    cy.server();
    // create proposal
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(user);
    cy.identity();
    cy.createProposal(proposal).then((res) => {
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      // Manually report proposal
      cy.findByText(/report/i).click();
      cy.findByLabelText(/censor reason/i).type("censor!");
      cy.route("POST", "/api/records/v1/setstatus").as("confirm");
      cy.findByText(/confirm/i).click();
      cy.wait("@confirm");
      cy.findByText(/ok/i).click();
      cy.findByText(/approve/i).should("not.exist");
      cy.route("POST", "/api/v1/proposals/batchvotesummary").as(
        "unvettedLoaded"
      );
      cy.visit("/proposals/unvetted?tab=censored");
      cy.wait("@unvettedLoaded");
      cy.findByText(proposal.name).should("be.visible");
    });
  });

  it("Can abandon a proposal", () => {
    cy.server();
    // create proposal
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(user);
    cy.identity();
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      cy.findByText(/waiting for author/i).should("exist");
      // Manually abandon
      cy.findByText(/abandon/i).click();
      cy.findByLabelText(/abandon reason/i).type("abandon!");
      cy.route("POST", "/api/v1/proposals/**/status").as("confirm");
      cy.findByText(/confirm/i).click();
      cy.wait("@confirm");
      cy.findByText(/ok/i).click();
      cy.findAllByText(/abandoned/).should("be.visible");
    });
  });

  it("Can authorize voting", () => {
    cy.server();
    // create proposal
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(user);
    cy.identity();
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      cy.findByText(/waiting for author/i).should("exist");
      // Manually authorize vote
      cy.findByRole("button", { name: /authorize voting/i }).click();
      cy.route("POST", "/api/v1/proposals/authorizevote").as(
        "confirmAuthorizeVote"
      );
      cy.findByText(/confirm/i)
        .should("be.visible")
        .click();
      cy.wait("@confirmAuthorizeVote");
      cy.findByTestId("close-confirm-msg").should("be.visible").click();
    });
  });
});
