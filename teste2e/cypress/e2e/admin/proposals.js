import { userByType, USER_TYPE_ADMIN } from "../../support/users/generate";
import {
  PROPOSAL_SUMMARY_STATUS_ACTIVE,
  PROPOSAL_SUMMARY_STATUS_UNVETTED,
  PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW,
  PROPOSAL_SUMMARY_STATUS_CENSORED,
  PROPOSAL_SUMMARY_STATUS_ABANDONED,
  makeProposal
} from "../../utils";

describe("Admin proposals actions", () => {
  const user = userByType(USER_TYPE_ADMIN);
  const { files } = makeProposal({});
  beforeEach(() => {
    cy.useTicketvoteApi();
    cy.useRecordsApi();
    cy.usePiApi();
    cy.useWwwApi();
    cy.useCommentsApi();
    cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true, user });
    cy.usersMiddleware("users", { amount: 1 }, {}, ["publickey"]);
  });

  it("Should allow admins to approve unvetted proposals from details", () => {
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_UNVETTED]: 1 }
    });
    cy.visit("record/testtoken");
    cy.recordsMiddleware("details", { status: 1, state: 1, user, files });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 1 }
    });
    cy.findByText(/approve/i).click();
    cy.recordsMiddleware("details", { status: 2, state: 2, user, files });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW]: 1 }
    });
    cy.recordsMiddleware("setstatus", { user, oldStatus: 1, state: 2 });
    cy.findByText(/confirm/i).click();
    cy.wait("@records.setstatus");
    cy.findByText(/Ok/).click();
    cy.wait(1000);
    cy.findByText(/waiting for author/i).should("be.visible");
  });

  it("Should allow admins to report a proposal as a spam", () => {
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW]: 1 }
    });
    cy.recordsMiddleware("details", { status: 2, state: 2, user, files });
    cy.visit("record/testtoken");
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 1 }
    });
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.wait("@ticketvote.summaries");
    cy.findByText(/report/i).click();
    cy.findByLabelText(/censor reason/i).type("censor!");
    cy.recordsMiddleware("setstatus", { user, oldStatus: 2, state: 2 });
    cy.recordsMiddleware("details", { status: 3, state: 2, user, files });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_CENSORED]: 1 }
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { ineligible: 1 }
    });
    cy.findByText(/confirm/i).click();
    cy.wait("@records.setstatus");
    cy.findByTestId("reason-confirm-success").click();
    cy.findByText(/this proposal has been censored/i).should("be.visible");
  });

  it("Should allow admins to abandon proposals", () => {
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW]: 1 }
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 1 }
    });
    cy.recordsMiddleware("details", { status: 2, state: 2, user, files });
    cy.visit("record/testtoken");
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.wait("@ticketvote.summaries");
    cy.findByText(/waiting for author/i).should("exist");
    cy.findByText(/abandon/i).click();
    cy.findByLabelText(/abandon reason/i).type("abandon!");
    cy.recordsMiddleware("setstatus", { user, oldStatus: 2, state: 2, files });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_ABANDONED]: 1 }
    });
    cy.findByText(/confirm/i).click();
    cy.wait("@records.setstatus");
    cy.findByTestId("reason-confirm-success").click();
    cy.findByText(/this proposal has been abandoned by/i).should("be.visible");
  });

  it("Should allow proposal author to authorize voting", () => {
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW]: 1 }
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 1 }
    });
    cy.recordsMiddleware("details", { status: 2, state: 2, user, files });
    cy.visit("record/testtoken");
    cy.findByText(/waiting for author/i).should("exist");
    // Manually authorize vote
    cy.findByRole("button", { name: /authorize voting/i }).click();
    cy.ticketvoteMiddleware("authorize");
    cy.findByText(/confirm/i)
      .should("be.visible")
      .click();
    cy.wait("@ticketvote.authorize");
    cy.findByTestId("modal-confirm-success-msg").should("be.visible").click();
    cy.findByText(/waiting for admin to start voting/i).should("be.visible");
    cy.findByText(/start vote/i).should("be.visible");
    cy.findByText(/revoke voting authorization/i).should("be.visible");
  });

  it("Should allow admins to set the billing status of a completed proposal", () => {
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_ACTIVE]: 1 }
    });
    cy.piMiddleware("billingstatuschanges", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_ACTIVE]: 1 },
      billingChangesAmount: 0
    });
    cy.recordsMiddleware("details", { status: 2, state: 2, user, files });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { approved: 1 }
    });
    cy.visit("record/testtoken");
    cy.findByText(/set billing status/i).click();
    cy.get("#select-billing-status").click();
    // Pick the completed billing status.
    cy.get("#react-select-3-option-1").click();
    cy.piMiddleware("setbillingstatus");
    cy.findByTestId("set-billing-status").click();
    cy.findByText(
      /the proposal billing status has been successfully set/i
    ).should("be.visible");
  });

  it("Should allow admins to set the billing status of a closed proposal", () => {
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_ACTIVE]: 1 }
    });
    cy.piMiddleware("billingstatuschanges", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_ACTIVE]: 1 },
      billingChangesAmount: 0
    });
    cy.recordsMiddleware("details", { status: 2, state: 2, user, files });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { approved: 1 }
    });
    cy.visit("record/testtoken");
    cy.findByText(/set billing status/i).click();
    cy.get("#select-billing-status").click();
    // Pick the completed billing status.
    cy.get("#react-select-3-option-2").click();
    cy.get("#billing-status-reason").type("inactive proposal");
    cy.piMiddleware("setbillingstatus");
    cy.findByTestId("set-billing-status").click();
    cy.findByText(
      /the proposal billing status has been successfully set/i
    ).should("be.visible");
  });

  it("Shouldn't allow admins set a billing status when number of billing status changes exceeds the `billingstatuschangesmax` policy", () => {
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_ACTIVE]: 1 }
    });
    cy.piMiddleware("billingstatuschanges", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_ACTIVE]: 1 },
      billingChangesAmount: 1
    });
    cy.recordsMiddleware("details", { status: 2, state: 2, user, files });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { approved: 1 }
    });
    cy.visit("record/testtoken");
    cy.wait("@records.details");
    cy.findByText(/set billing status/i).should("not.exist");
  });
});
