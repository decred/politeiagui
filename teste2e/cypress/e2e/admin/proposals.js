import { buildProposal } from "../../support/generate";
import {
  shortRecordToken,
  PROPOSAL_SUMMARY_STATUS_ACTIVE,
  PROPOSAL_SUMMARY_STATUS_ClOSED,
  PROPOSAL_SUMMARY_STATUS_COMPLETED,
  PROPOSAL_BILLING_STATUS_CLOSED,
  PROPOSAL_BILLING_STATUS_COMPLETED,
  PROPOSAL_VOTING_APPROVED
} from "../../utils";

describe("Admin proposals actions", () => {
  it("Should allow admins to approve propsoals", () => {
    cy.server();
    // paid admin user with proposal credits
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.login(user);
    cy.identity();
    // create proposal
    const proposal = buildProposal();
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
        cy.findByText(/Ok/).click();
        cy.wait(1000);
        cy.findByText(/waiting for author/i).should("be.visible");
      }
    );
  });

  it("Should allow admins to report a proposal as a spam", () => {
    cy.server();
    // paid admin user with proposal credits
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.login(user);
    cy.identity();
    // create proposal
    const proposal = buildProposal();
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
        cy.intercept("/api/records/v1/records").as("records");
        cy.visit("/admin/records?tab=censored");
        cy.wait("@records");
        cy.findByText(shortRecordToken(token)).should("be.visible");
      }
    );
  });

  it("Should allow admins to abandon proposals", () => {
    cy.server();
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.login(user);
    cy.identity();
    // create proposal
    const proposal = buildProposal();
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
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.login(user);
    cy.identity();
    // create proposal
    const proposal = buildProposal();
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
        cy.findByTestId("modal-confirm-success-msg")
          .should("be.visible")
          .click();
      }
    );
  });

  it("Should allow admins to set the billing status of an active propsoal", () => {
    cy.server();
    // paid admin user with proposal credits
    const admin = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.login(admin);
    cy.identity();
    // create proposal
    const proposal = buildProposal();
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
        // Mock proposal summary reply and set proposal status to
        // active in order to test author updates.
        cy.middleware("pi.summaries", {
          token,
          status: PROPOSAL_SUMMARY_STATUS_ACTIVE
        });
        // Mock vote summary reply to set proposal vote status to
        // approved to test author updates.
        cy.middleware("ticketvote.summaries", {
          token,
          status: PROPOSAL_VOTING_APPROVED
        });
        cy.visit(`record/${shortRecordToken(token)}`);
        cy.wait("@ticketvote.summaries");
        cy.wait("@pi.summaries");
        cy.findByText(/set billing status/i).click();
        cy.get("#select-billing-status").click();
        // Pick the completed billing status.
        cy.get("#react-select-3-option-0").click();
        cy.middleware("pi.setBillingStatus");
        cy.findByTestId("set-billing-status").click();
        // Ensure mocked response has 200 status code
        cy.wait("@pi.setBillingStatus")
          .its("response.statusCode")
          .should("eq", 200);
        // Ensure success modal is displayed
        cy.findByText(/ok/i).click();
      }
    );
  });

  it("Should allow admins to set the billing status of a closed propsoal", () => {
    cy.server();
    // paid admin user with proposal credits
    const admin = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.login(admin);
    cy.identity();
    // create proposal
    const proposal = buildProposal();
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
        // Mock proposal summary reply and set proposal status to
        // active closed.
        cy.middleware("pi.summaries", {
          token,
          status: PROPOSAL_SUMMARY_STATUS_ClOSED
        });
        // Mock vote summary reply to set proposal vote status to
        // approved to test author updates.
        cy.middleware("ticketvote.summaries", {
          token,
          status: PROPOSAL_VOTING_APPROVED
        });
        cy.visit(`record/${shortRecordToken(token)}`);
        cy.wait("@pi.summaries");
        cy.wait("@ticketvote.summaries");
        cy.findByText(/set billing status/i).click();
        cy.get("#select-billing-status").click();
        // Pick the completed billing status.
        cy.get("#react-select-3-option-0").click();
        cy.middleware("pi.setBillingStatus");
        cy.findByTestId("set-billing-status").click();
        // Ensure mocked response has 200 status code
        cy.wait("@pi.setBillingStatus")
          .its("response.statusCode")
          .should("eq", 200);
        // Ensure success modal is displayed
        cy.findByText(/ok/i).click();
      }
    );
  });

  it("Should allow admins to set the billing status of a completed propsoal", () => {
    cy.server();
    // paid admin user with proposal credits
    const admin = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.login(admin);
    cy.identity();
    // create proposal
    const proposal = buildProposal();
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
        // Mock proposal summary reply and set proposal status to
        // completed.
        cy.middleware("pi.summaries", {
          token,
          status: PROPOSAL_SUMMARY_STATUS_COMPLETED
        });
        // Mock vote summary reply to set proposal vote status to
        // approved to test author updates.
        cy.middleware("ticketvote.summaries", {
          token,
          status: PROPOSAL_VOTING_APPROVED
        });
        // Mock billing status changes request.
        cy.middleware("pi.billingstatuschanges", {
          body: {
            billingstatuschanges: {
              [token]: [
                {
                  token,
                  publickey: "some_public_key",
                  status: PROPOSAL_BILLING_STATUS_COMPLETED
                }
              ]
            }
          }
        });
        // Mock policy reply
        cy.middleware("pi.policy", {
          body: {
            namesupportedchars: ["A-z", "0-9"],
            billingstatuschangesmax: 2
          }
        });
        cy.visit(`record/${shortRecordToken(token)}`);
        cy.wait("@pi.policy");
        cy.wait("@pi.summaries");
        cy.wait("@ticketvote.summaries");
        cy.wait("@pi.billingstatuschanges");
        cy.findByText(/set billing status/i).click();
        cy.get("#select-billing-status").click();
        // Pick the completed billing status.
        cy.get("#react-select-3-option-0").click();
        cy.middleware("pi.setBillingStatus");
        cy.findByTestId("set-billing-status").click();
        // Ensure mocked response has 200 status code
        cy.wait("@pi.setBillingStatus")
          .its("response.statusCode")
          .should("eq", 200);
        // Ensure success modal is displayed
        cy.findByText(/ok/i).click();
      }
    );
  });

  it("Shouldn't allow admins set a billing status when number of billing status changes exceeds the `billingstatuschangesmax` policy", () => {
    cy.server();
    // paid admin user with proposal credits
    const admin = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.login(admin);
    cy.identity();
    // create proposal
    const proposal = buildProposal();
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
        // Mock proposal summary reply and set proposal status to
        // completed.
        cy.middleware("pi.summaries", {
          token,
          status: PROPOSAL_SUMMARY_STATUS_COMPLETED
        });
        // Mock vote summary reply to set proposal vote status to
        // approved to test author updates.
        cy.middleware("ticketvote.summaries", {
          token,
          status: PROPOSAL_VOTING_APPROVED
        });
        // Mock billing status changes request.
        cy.middleware("pi.billingstatuschanges", {
          body: {
            billingstatuschanges: {
              [token]: [
                {
                  token,
                  publickey: "some_public_key",
                  reason: "closed!",
                  status: PROPOSAL_BILLING_STATUS_CLOSED
                },
                {
                  token,
                  publickey: "some_public_key",
                  status: PROPOSAL_BILLING_STATUS_COMPLETED
                }
              ]
            }
          }
        });
        // Mock policy reply
        cy.middleware("pi.policy", {
          body: {
            billingstatuschangesmax: 1
          }
        });
        cy.visit(`record/${shortRecordToken(token)}`);
        cy.wait("@pi.policy");
        cy.wait("@pi.summaries");
        cy.wait("@pi.billingstatuschanges");
        cy.wait("@ticketvote.summaries");
        cy.findByText(/set billing status/i).should("not.exist");
      }
    );
  });
});
