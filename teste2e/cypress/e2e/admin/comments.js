import { userByType, USER_TYPE_ADMIN } from "../../support/users/generate";
import {
  PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW,
  makeProposal
} from "../../utils";

describe("User admin comments", () => {
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
  it("Can censor comments", () => {
    cy.recordsMiddleware("details", { status: 1, state: 1, user, files });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 1 }
    });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW]: 1 }
    });
    cy.commentsMiddleware("comments", { count: 3 });
    cy.commentsMiddleware("del", { userid: user.userid });
    cy.visit("/record/testtoken");
    cy.wait("@records.details");
    cy.wait("@comments.comments");
    cy.findAllByTestId("comment-censor").first().click();
    cy.findByLabelText(/censor reason/i).type("censor");
    cy.findByTestId("reason-confirm").click();
    cy.findByTestId("reason-confirm-success").click();
    cy.findByText(/censored by/i).should("be.visible");
  });
});
