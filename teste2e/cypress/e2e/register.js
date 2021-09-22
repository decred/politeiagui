import { buildUser } from "../support/generate";

describe("Registration", () => {
  it("Can register users", () => {
    const user = buildUser();
    cy.visit("/");
    cy.findByText(/sign up/i).click();
    cy.findByLabelText(/email/i).type(user.email);
    cy.findByLabelText(/username/i).type(user.username);
    cy.findAllByLabelText(/password/i)
      .first()
      .type(user.password);
    cy.findAllByLabelText(/password/i)
      .last()
      .type(user.password);
    cy.findByRole("button", { text: /sign up/i }).click();
    cy.findByText(/i understand/i).click();
    cy.findByText(
      /Please check your inbox to verify your registration/i
    ).should("exist");
  });
  it("can pay the registration fee", () => {
    const unpaidUser = {
      email: "user3@example.com",
      password: "password"
    };
    cy.login(unpaidUser);
    cy.visit("/");
    cy.findByTestId("registration-fee-btn").click();
    cy.findByTestId("payment-component").should("be.visible");
    cy.middleware("users.payments.registration");
    cy.middleware("users.payments.paywall");
    cy.wait("@users.payments.registration", { timeout: 10000 });
    cy.findByTestId("payment-status-tag")
      .should("be.visible")
      .children()
      .should("have.text", "Confirmed");
  });
});
