import {
  PROPOSAL_METADATA_FILENAME,
  VOTE_METADATA_FILENAME
} from "../../utils";
import compose from "lodash/fp/compose";
import filter from "lodash/fp/filter";
import keys from "lodash/fp/keys";
import first from "lodash/fp/first";
import get from "lodash/fp/get";
import find from "lodash/fp/find";

function findRecordFileByName(record, name) {
  return compose(
    find((file) => file.name === name),
    get("files")
  )(record);
}

function getShortProposalToken(records = {}) {
  return compose(
    first,
    filter(
      (token) =>
        !findRecordFileByName(records[token], VOTE_METADATA_FILENAME) &&
        findRecordFileByName(records[token], PROPOSAL_METADATA_FILENAME)
    ),
    keys
  )(records);
}

describe("Record Details", () => {
  describe("proposal details", () => {
    let token, shortToken;
    beforeEach(() => {
      cy.intercept("/api/records/v1/records").as("records");
      cy.intercept("/api/records/v1/details").as("details");
    });
    describe("regular proposal renders correctly", () => {
      beforeEach(() => {
        cy.visit("/");
        cy.wait("@records").then(({ response: { body } }) => {
          const { records } = body;
          shortToken = getShortProposalToken(records);
          token = records[shortToken].censorshiprecord.token;
          expect(
            shortToken,
            "You should have at least one record Under Review."
          ).to.exist;
        });
      });
      it("can render proposal correctly by short token", () => {
        cy.visit(`/record/${shortToken}`);
        cy.wait("@details");
      });
      it("can render proposal correctly by full token", () => {
        cy.visit(`/record/${token}`);
        cy.wait("@details");
      });
      afterEach(() => {
        // assert token clipboard existence
        cy.get("[data-testid='record-token'] > span")
          .first()
          .should("be.visible")
          .and("have.text", token);
        // assert header existence
        cy.get("[data-testid='record-header']")
          .children()
          .should("be.visible")
          .and("have.length", 2);
        // assert description existence
        cy.get("[data-testid='markdown-wrapper']").should("exist");
        // assert metadata existence
        cy.get("[data-testid='record-metadata']")
          .should("include.text", "Domain")
          .and("include.text", "Amount")
          .and("include.text", "Start Date")
          .and("include.text", "End Date");
      });
    });
    describe("invalid proposal rendering", () => {
      it("should dislpay not found message for nonexistent proposals", () => {
        cy.visit("/record/invalidtoken");
        cy.wait("@details").its("response.statusCode").should("eq", 400);
      });
    });
    describe("user proposals actions", () => {
      const admin = {
        email: "adminuser@example.com",
        username: "adminuser",
        password: "password"
      };
      beforeEach(() => {
        cy.login(admin);
        cy.visit("/admin/records");
        cy.wait("@records").then(({ response: { body } }) => {
          const { records } = body;
          shortToken = getShortProposalToken(records);
          expect(shortToken, "You should have at least one unvetted record.").to
            .exist;
        });
      });
      it("should be able to logout from unvetted proposal details page", () => {
        cy.middleware("comments.comments", 10, 1);
        cy.visit(`/record/${shortToken}`);
        cy.wait("@details");
        cy.findByTestId("record-header").should("be.visible");
        cy.findByTestId("markdown-wrapper").should("exist");
        cy.userLogout(admin.username);
        cy.wait(2000);
        // assert that proposal files were removed from store
        cy.findByTestId("record-header").should("be.visible");
        cy.findByTestId("markdown-wrapper").should("not.exist");
        cy.get("#commentArea").should("not.exist");
      });
      it("should render unvetted proposal details after admin/author login", () => {
        cy.visit("/");
        cy.wait("@records");
        cy.userLogout(admin.username);
        cy.visit(`/record/${shortToken}`);
        cy.wait("@details");
        cy.findByTestId("wayt-login-button").click();
        cy.typeLoginModal(admin);
        cy.findByTestId("markdown-wrapper").should("exist");
        cy.get("#commentArea").should("exist");
      });
    });
  });
});
