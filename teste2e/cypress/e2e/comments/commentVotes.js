import { shortRecordToken } from "../../utils";

beforeEach(() => {
  cy.usersMiddleware("users", { amount: 1 }, {}, ["publickey"]);
});

describe("Comments Votes", () => {
  beforeEach(() => {
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.login(user);
    cy.identity();
  });
  describe("succeeded votes", () => {
    let token;
    beforeEach(() => {
      cy.middleware("comments.comments", 5);
      cy.middleware("comments.vote");
      cy.intercept("/api/ticketvote/v1/inventory").as("inventory");
      cy.visit("/");
      cy.wait("@inventory").then(
        ({ response: { body } }) => (token = body.vetted.unauthorized[0])
      );
    });
    it("should submit comments votes successfully", () => {
      let upvotes, downvotes;
      cy.visit(`/record/${shortRecordToken(token)}`);
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
      cy.visit(`/record/${shortRecordToken(token)}`);
      cy.wait("@comments.comments");
      cy.findAllByTestId("score-like")
        .first()
        .then((score) => (upvotes = score[0].innerText));
      cy.route("POST", "api/comments/v1/vote").as("vote");
      cy.findAllByTestId("like-btn").first().dblclick();
      cy.wait("@vote");
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
    let token;
    beforeEach(() => {
      cy.middleware("comments.comments", 5);
      cy.intercept("/api/ticketvote/v1/inventory").as("inventory");
      cy.visit("/");
      cy.wait("@inventory").then(
        ({ response: { body } }) => (token = body.vetted.unauthorized[0])
      );
    });
    it("should display error message", () => {
      cy.middleware("comments.vote", {
        errorCode: 10,
        statusCode: 400,
        delay: 3000
      });
      cy.visit(`/record/${shortRecordToken(token)}`);
      cy.findByText(/Error/).should("not.exist");
      cy.wait("@comments.comments");
      cy.findAllByTestId("dislike-btn").first().click();
      cy.wait("@comments.vote");
      cy.findByText(/Error/).should("exist");
    });
    it("should reset votes count on error", () => {
      cy.middleware("comments.vote", {
        errorCode: 10,
        statusCode: 400,
        delay: 3000
      });
      let upvotes;
      cy.visit(`/record/${shortRecordToken(token)}`);
      cy.findAllByTestId("score-like")
        .first()
        .then((score) => (upvotes = score[0].innerText));
      cy.wait(1000);
      cy.findAllByTestId("like-btn").first().click();
      cy.wait(1000);
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
      cy.middleware("comments.vote", { statusCode: 403 });
      cy.visit(`/record/${shortRecordToken(token)}`);
      cy.findAllByTestId("like-btn").first().click();
      cy.wait(1000);
      cy.findByTestId("modal-login").should("exist");
    });
  });
});
