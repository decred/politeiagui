import { buildProposal } from "../../support/generate";
import { APIPluginError } from "../../errors";

describe("Proposal Form Error Codes Mapping", () => {
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

  it("Should map invalid name error code to a readable error message", () => {
    const proposal = buildProposal();
    // Set invalid name.
    proposal.name = "grrrr";
    cy.createProposal(proposal).then(
      ({ pluginid, errorcode, errorcontext }) => {
        try {
          APIPluginError(pluginid, errorcode, errorcontext);
        } catch ({ message, errorcode }) {
          expect(message).to.have.string("Proposal name is invalid");
        }
      }
    );
  });

  it("Should map invalid start date error code to a readable error message", () => {
    const proposal = buildProposal();
    // Set invalid start date.
    proposal.startDate = Math.round(new Date().getTime() / 1000);
    cy.createProposal(proposal).then(
      ({ pluginid, errorcode, errorcontext }) => {
        try {
          APIPluginError(pluginid, errorcode, errorcontext);
        } catch ({ message, errorcode }) {
          expect(message).to.have.string("Proposal start date is invalid");
        }
      }
    );
  });

  it("Should map invalid end date error code to a readable error message", () => {
    const proposal = buildProposal();
    // Set invalid end date.
    proposal.endDate = Math.round(new Date().getTime() / 1000);
    cy.createProposal(proposal).then(
      ({ pluginid, errorcode, errorcontext }) => {
        try {
          APIPluginError(pluginid, errorcode, errorcontext);
        } catch ({ message, errorcode }) {
          expect(message).to.have.string("Proposal end date is invalid");
        }
      }
    );
  });

  it("Should map invalid amount error code to a readable error message", () => {
    const proposal = buildProposal();
    // Set invalid amount.
    proposal.amount = 0;
    cy.createProposal(proposal).then(
      ({ pluginid, errorcode, errorcontext }) => {
        try {
          APIPluginError(pluginid, errorcode, errorcontext);
        } catch ({ message, errorcode }) {
          expect(message).to.have.string("Proposal amount is invalid");
        }
      }
    );
  });

  it("Should map invalid domain error code to a readable error message", () => {
    const proposal = buildProposal();
    // Set invalid domain.
    proposal.domain = "grrr";
    cy.createProposal(proposal).then(
      ({ pluginid, errorcode, errorcontext }) => {
        try {
          APIPluginError(pluginid, errorcode, errorcontext);
        } catch ({ message, errorcode }) {
          expect(message).to.have.string("Proposal domain is invalid");
        }
      }
    );
  });
});
