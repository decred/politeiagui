import {
  makeProposal,
  PROPOSAL_SUMMARY_STATUS_ACTIVE,
  PROPOSAL_SUMMARY_STATUS_CLOSED,
  PROPOSAL_SUMMARY_STATUS_COMPLETED
} from "../../utils";
import { userByType, USER_TYPE_USER } from "../../support/users/generate";

describe("Proposal author updates", () => {
  const { files } = makeProposal({});
  const user = userByType(USER_TYPE_USER);
  const user2 = userByType(USER_TYPE_USER);
  beforeEach(() => {
    cy.useTicketvoteApi();
    cy.useRecordsApi();
    cy.usePiApi();
    cy.useWwwApi();
    cy.useCommentsApi();
  });
  it("Should allow proposal author to submit updates on active proposals ", () => {
    cy.userEnvironment(USER_TYPE_USER, { verifyIdentity: true, user });
    cy.recordsMiddleware("details", { state: 2, status: 2, files, user });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_ACTIVE]: 1 }
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { approved: 1 }
    });
    cy.visit("record/testtoken");
    cy.wait("@records.details");
    cy.findByTestId(/update-title/i)
      .clear()
      .type("update title");
    cy.findByTestId(/text-area/i)
      .clear()
      .type("author update body");
    cy.commentsMiddleware("new", { user, commentid: 1 });
    cy.findByText(/add comment/i).click();
    cy.findByText("update title").should("be.visible");
  });

  it("Shouldn't allow proposal author to submit updates on closed proposals", () => {
    cy.userEnvironment(USER_TYPE_USER, { verifyIdentity: true, user });
    cy.recordsMiddleware("details", { state: 2, status: 2, files, user });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_CLOSED]: 1 }
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { approved: 1 }
    });
    cy.visit("record/testtoken");
    cy.wait("@records.details");
    cy.findByTestId(/update-title/i).should("not.exist");
    cy.findByText(/comments are not allowed/i).should("be.visible");
  });

  it("Shouldn't allow proposal author to submit updates on completed proposals", () => {
    cy.userEnvironment(USER_TYPE_USER, { verifyIdentity: true, user });
    cy.recordsMiddleware("details", { state: 2, status: 2, files, user });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_COMPLETED]: 1 }
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { approved: 1 }
    });
    cy.visit("record/testtoken");
    cy.wait("@records.details");
    cy.findByTestId(/update-title/i).should("not.exist");
    cy.findByText(/comments are not allowed/i).should("be.visible");
  });

  it("should allow normal users to reply only on the latest author update", () => {
    cy.userEnvironment(USER_TYPE_USER, { verifyIdentity: true, user: user2 });
    cy.recordsMiddleware("details", { state: 2, status: 2, files, user });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_ACTIVE]: 1 }
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { approved: 1 }
    });
    cy.commentsMiddleware("comments", {
      count: 1,
      extra: {
        extradata: JSON.stringify({ title: "update 1" }),
        extradatahint: "proposalupdate"
      }
    });
    // Normal users shouldn't be able to post normal comments at this level
    // and only reply on latest author update thread.
    cy.visit("record/testtoken");
    cy.wait("@records.details");
    cy.wait("@comments.comments");
    cy.findByTestId(/text-area/i).should("not.exist");
    cy.findByText(/reply/i).click();
    cy.findByTestId(/text-area/i)
      .clear()
      .type("reply update");
    cy.commentsMiddleware("new", { user: user2, commentid: 2 });
    cy.findByText(/add comment/i).click();
    cy.wait("@comments.new");
    cy.findByText("reply update").should("be.visible");
  });
});
