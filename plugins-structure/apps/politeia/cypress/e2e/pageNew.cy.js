Cypress.Commands.add("setProposalFormType", (type) =>
  cy
    .findByTestId("proposal-form-type")
    .should("be.visible")
    .click()
    .findByText(type)
    .click()
);

describe("Given New page", () => {
  beforeEach(() => {
    cy.visit("/record/new");
  });
  it("should render Proposal Form, Rules and Drafts warning", () => {
    cy.findByTestId("record-form").should("be.visible");
    cy.findByText(/Drafts are saved locally/i).should("be.visible");
    cy.findByTestId("proposal-form-rules").should("be.visible");
  });
  it("should render correct form elements for form initial values", () => {
    cy.findByTestId("proposal-form-type").should("be.visible");
    cy.findByTestId("proposal-form-name-input").should("be.visible");
    cy.findByTestId("proposal-form-amount-input").should("be.visible");
    cy.findByTestId("proposal-form-start-date-input").should("be.visible");
    cy.findByTestId("proposal-form-end-date-input").should("be.visible");
    cy.findByTestId("proposal-form-domain").should("be.visible");
    cy.findByTestId("proposal-form-markdown-input").should("be.visible");
    cy.findByTestId("proposal-form-save-draft-button").should("be.visible");
    cy.findByTestId("proposal-form-submit-button").should("be.visible");
  });
  it("should render RFP Proposal form elements for RFP Proposal type", () => {
    cy.setProposalFormType("RFP Proposal");

    cy.findByTestId("proposal-form-type").should("be.visible");
    cy.findByTestId("proposal-form-name-input").should("be.visible");
    cy.findByTestId("proposal-form-rfp-deadline-input").should("be.visible");
    cy.findByTestId("proposal-form-domain").should("be.visible");
    cy.findByTestId("proposal-form-markdown-input").should("be.visible");
    cy.findByTestId("proposal-form-save-draft-button").should("be.visible");
    cy.findByTestId("proposal-form-submit-button").should("be.visible");
  });
  it("should render RFP Submission form elements for RFP Submission type", () => {
    cy.setProposalFormType("RFP Submission");

    cy.findByTestId("proposal-form-type").should("be.visible");
    cy.findByTestId("proposal-form-rfp-token-input").should("be.visible");
    cy.findByTestId("proposal-form-name-input").should("be.visible");
    cy.findByTestId("proposal-form-amount-input").should("be.visible");
    cy.findByTestId("proposal-form-start-date-input").should("be.visible");
    cy.findByTestId("proposal-form-end-date-input").should("be.visible");
    cy.findByTestId("proposal-form-domain").should("be.visible");
    cy.findByTestId("proposal-form-markdown-input").should("be.visible");
    cy.findByTestId("proposal-form-save-draft-button").should("be.visible");
    cy.findByTestId("proposal-form-submit-button").should("be.visible");
  });
  it("should render Regular Proposal form elements for Regular Proposal type", () => {
    cy.setProposalFormType("Regular Proposal");

    cy.findByTestId("proposal-form-type").should("be.visible");
    cy.findByTestId("proposal-form-name-input").should("be.visible");
    cy.findByTestId("proposal-form-amount-input").should("be.visible");
    cy.findByTestId("proposal-form-start-date-input").should("be.visible");
    cy.findByTestId("proposal-form-end-date-input").should("be.visible");
    cy.findByTestId("proposal-form-domain").should("be.visible");
    cy.findByTestId("proposal-form-markdown-input").should("be.visible");
    cy.findByTestId("proposal-form-save-draft-button").should("be.visible");
    cy.findByTestId("proposal-form-submit-button").should("be.visible");
  });
});
