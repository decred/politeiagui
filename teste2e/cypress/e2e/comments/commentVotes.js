import { generateTokenPair, makeProposal, PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED, shortRecordToken } from "../../utils";
import { USER_TYPE_ADMIN, USER_TYPE_UNPAID } from "../../support/users/generate";

beforeEach(() => {
  cy.server();
  cy.useTicketvoteApi();
  cy.useRecordsApi();
  cy.usePiApi();
  cy.useWwwApi();
  cy.useCommentsApi();
  //cy.userEnvironment(USER_TYPE_ADMIN);
  cy.usersMiddleware(null, { amount: 1 }, {}, ["publickey"]);
  const { token, shortToken } = generateTokenPair();
  const { files } = makeProposal({});
  cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true });
  cy.recordsMiddleware("details", {
    status: 2,
    state: 2,
    files,
    token
  });
  cy.ticketvoteMiddleware("summaries", {
    amountByStatus: { unauthorized: 1 }
  });
  cy.piMiddleware("summaries", {
    amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
  });
  // setup comments (5 items)
  const count = 5;
  cy.commentsMiddleware("vote", { delay: 3000 });
  cy.commentsMiddleware("count", { count });
  cy.commentsMiddleware("comments", { count, maxUpvote: 5, maxDownVote: 5 });
  cy.visit(`record/${shortToken}`);
  cy.wait("@records.details");
  cy.wait("@pi.summaries");
});

describe("Comments Votes", () => {
  /*beforeEach(() => {
    cy.userEnvironment(USER_TYPE_ADMIN);
  });*/
  describe("succeeded votes", () => {
    it("should submit comments votes successfully", () => {
      let upvotes, downvotes;
      cy.wait("@comments.comments");
      // like action
      cy.findAllByTestId("score-like")
        .first()
        .then((score) => (upvotes = score[0].innerText));
      cy.findAllByTestId("like-btn").first().click();
      cy.wait("@comments.vote");
      cy.findAllByTestId("score-like")
        .first()
        .then((score) => {
          const newup = score[0].innerText;
          expect(Number(newup)).to.equal(Number(upvotes) + 1);
          upvotes = newup;
        });
      // dislike action
      cy.findAllByTestId("score-dislike")
        .first()
        .then((score) => (downvotes = score[0].innerText));
      cy.findAllByTestId("dislike-btn").first().click();
      cy.wait("@comments.vote");
      // check if downvotes count has increased
      cy.findAllByTestId("score-dislike")
        .first()
        .then((score) => {
          const newdown = score[0].innerText;
          expect(Number(newdown)).to.equal(Number(downvotes) + 1);
          downvotes = newdown;
        });
      // check if upvotes count has decreased
      cy.findAllByTestId("score-like")
        .first()
        .then((score) => {
          const newup = score[0].innerText;
          expect(Number(newup)).to.equal(Number(upvotes) - 1);
        });
    });
    it("should prevent multi-clicking", () => {
      let upvotes;
      cy.wait("@comments.comments");
      cy.findAllByTestId("score-like")
        .first()
        .then((score) => (upvotes = score[0].innerText));
      cy.route("POST", "api/comments/v1/vote").as("vote");
      cy.findAllByTestId("like-btn").first().dblclick();
      cy.wait("@comments.vote");
      cy.shouldBeCalled("vote", 1);

      cy.findAllByTestId("score-like")
        .first()
        .then((score) => {
          const newup = score[0].innerText;
          expect(Number(newup)).to.equal(Number(upvotes) + 1);
        });
    });
  });
  describe("failed votes", () => {
    it("should display error message", () => {
      cy.commentsMiddleware("vote", {
        error: { errorcode: 10, statuscode: 400 }
      });
      cy.findByText(/Error/).should("not.exist");
      cy.findAllByTestId("dislike-btn").first().click();
      cy.wait("@comments.vote");
      cy.findByText(/Error/).should("exist");
    });
    it("should reset votes count on error", () => {
      cy.commentsMiddleware("vote", { delay: 3000, error: { errorcode: 10, statuscode: 400 } });
      let upvotes;
      cy.findAllByTestId("score-like")
        .first()
        .then((score) => (upvotes = score[0].innerText));
      cy.findAllByTestId("like-btn").first().click();
      cy.wait(500);
      cy.findAllByTestId("score-like")
        .first()
        .then((score) => {
          const newup = score[0].innerText;
          expect(Number(newup)).to.equal(Number(upvotes) + 1);
        });
      cy.wait("@comments.vote");
      // assert votes count after delayed vote response
      cy.findAllByTestId("score-like")
        .first()
        .then((score) => {
          const newup = score[0].innerText;
          expect(Number(newup)).to.equal(Number(upvotes));
        });
    });
    it("should display login modal when voting with an expired user session", () => {
      cy.commentsMiddleware("vote", {
        error: { statuscode: 403, omitBody: true }
      });
      cy.wait("@comments.comments");
      cy.findAllByTestId("like-btn").first().click();
      cy.wait("@comments.vote");
      cy.findByTestId("modal-login").should("exist");
    });
  });
});
