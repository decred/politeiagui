import { buildProposal } from "../../support/generate";
import { shortRecordToken, PROPOSAL_VOTING_APPROVED } from "../../utils";

describe("Admin proposals actions", () => {
  it("Should allow admins to approve propsoals", () => {
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
        cy.visit(`record/${shortRecordToken(token)}`);
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

  it("Should allow admins to report a proposal as a spam", () => {
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
        cy.visit(`record/${shortRecordToken(token)}`);
        // Manually report proposal
        cy.findByText(/report/i).click();
        cy.findByLabelText(/censor reason/i).type("censor!");
        cy.route("POST", "/api/records/v1/setstatus").as("confirm");
        cy.findByText(/confirm/i).click();
        cy.wait("@confirm");
        cy.findByText(/ok/i).click();
        cy.findByText(/approve/i).should("not.exist");
        cy.visit("/admin/records?tab=censored");
        cy.findByText(shortRecordToken(token)).should("be.visible");
      }
    );
  });

  it("Should allow admins to abandon proposals", () => {
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
          record: { censorshiprecord }
        }
      }) => {
        cy.approveProposal(censorshiprecord);
        cy.visit(`record/${shortRecordToken(censorshiprecord.token)}`);
        cy.findByText(/waiting for author/i).should("exist");
        // Manually abandon
        cy.findByText(/abandon/i).click();
        cy.findByLabelText(/abandon reason/i).type("abandon!");
        cy.route("POST", "/api/records/v1/setstatus").as("confirm");
        cy.findByText(/confirm/i).click();
        cy.wait("@confirm");
        cy.findByText(/ok/i).click();
        cy.findAllByText(/abandoned/).should("be.visible");
      }
    );
  });

  it("Should allow proposal author to authorize voting", () => {
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
          record: { censorshiprecord }
        }
      }) => {
        cy.approveProposal(censorshiprecord);
        cy.visit(`record/${shortRecordToken(censorshiprecord.token)}`);
        cy.findByText(/waiting for author/i).should("exist");
        // Manually authorize vote
        cy.findByRole("button", { name: /authorize voting/i }).click();
        cy.route("POST", "/api/ticketvote/v1/authorize").as(
          "confirmAuthorizeVote"
        );
        cy.findByText(/confirm/i)
          .should("be.visible")
          .click();
        cy.wait("@confirmAuthorizeVote");
        cy.findByTestId("close-confirm-msg").should("be.visible").click();
      }
    );
  });

  it.only("Should allow admins to set the billing status of an approved propsoal", () => {
    cy.server();
    // paid admin user with proposal credits
    cy.server();
    // create proposal
    const admin = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(admin);
    cy.identity();
    cy.createProposal(proposal).then(
      ({
        body: {
          record: {
            censorshiprecord: { token }
          }
        }
      }) => {
        cy.visit(`record/${shortRecordToken(token)}`);
        // Manually approve proposal
        cy.findByText(/approve/i).click();
        cy.route("POST", "/api/records/v1/setstatus").as("setstatus");
        cy.findByText(/confirm/i).click();
        cy.wait("@setstatus");
        // Mock vote summary reply to set proposal vote status to
        // approved to test author updates.
        cy.middleware("ticketvote.summaries", {
          token,
          status: PROPOSAL_VOTING_APPROVED
        });
        cy.visit(`record/${shortRecordToken(token)}`);
        cy.wait("@ticketvote.summaries");
        cy.findByText(/set billing status/i).click();
        cy.get("#select-billing-status").click();
        // Pick the completed billing status.
        cy.get("#react-select-3-option-0").click();
        // XXX move to a middleware when 2549 is in.
        cy.intercept("/api/pi/v1/setbillingstatus", (req) =>
          req.reply({
            body: {},
            statusCode: 200
          })
        ).as("setBillingStatus");
        cy.findByTestId("set-billing-status").click();
        // Ensure mocked response has 200 status code
        cy.wait("@setBillingStatus")
          .its("response.statusCode")
          .should("eq", 200);
        // Ensure success modal is displayed
        cy.findByText(/ok/i).should("be.visible");
      }
    );
  });
});
