import { buildProposal } from "../support/generate";

const user = {
  email: "adminuser@example.com",
  username: "adminuser",
  password: "password"
};

beforeEach(() => {
  cy.server();
  cy.login(user);
  cy.identity();
});

describe("Proposal Edit", () => {
  it("Can edit a public proposal as a proposal owner", () => {
    // create proposal
    const proposal = buildProposal();
    const { description: newDescription } = buildProposal();
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      // user is able to edit the proposal
      cy.findByTestId(/record-edit-button/i).click();
      cy.findByRole("button", { name: /submit/i }).should("be.disabled");
      cy.findByTestId("text-area").type(newDescription);
      cy.route("POST", "/api/v1/proposals/edit").as("editProposal");
      cy.findByRole("button", { name: /submit/i }).click();
      cy.wait("@editProposal", { timeout: 10000 })
        .its("status")
        .should("eq", 200);
      cy.findByText(/version 2/).should("exist");
    });
  });
  it("Can't edit a proposal if not the owner", () => {
    // create proposal
    const proposal = buildProposal();
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      // logout
      cy.logout(user);
      // login paid user
      const user1 = {
        email: "user1@example.com",
        username: "user1",
        password: "password"
      };
      cy.login(user1);
      cy.identity();
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      cy.findByTestId(/record-edit-button/i).should("not.exist");
    });
  });
  it("Can't edit an authorized voting proposal", () => {
    const proposal = buildProposal();
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      cy.route("POST", "api/v1/proposals/authorizevote").as("authorizeVote");
      cy.findByRole("button", { name: /authorize voting/i }).click();
      cy.findByRole("button", { name: /confirm/i }).click();
      cy.wait("@authorizeVote", { timeout: 3000 })
        .its("status")
        .should("eq", 200);
      cy.findByTestId(/close-confirm-msg/i).click();
      cy.findByTestId(/record-edit-button/i).should(
        "have.css",
        "pointer-events",
        "none"
      );
    });
  });
  it("Can't edit without making description changes", () => {
    // create proposal
    const proposal = buildProposal();
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      cy.findByTestId(/record-edit-button/i).click();
      cy.findByRole("button", { name: /submit/i }).should("be.disabled");
      cy.findByTestId("text-area").type(`{selectAll}${proposal.description}`);
      cy.findByRole("button", { name: /submit/i }).should("be.disabled");
    });
  });
  it("Can't edit without making title changes", () => {
    // create proposal
    const proposal = buildProposal();
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      cy.findByTestId(/record-edit-button/i).click();
      cy.findByRole("button", { name: /submit/i }).should("be.disabled");
      cy.findByTestId("proposal-name").type(`{selectAll}${proposal.name}`);
      cy.findByRole("button", { name: /submit/i }).should("be.disabled");
    });
  });
});
