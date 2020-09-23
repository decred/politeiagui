describe("Proposals", () => {
  it.only("Can create proposals", () => {
    cy.visit("/");
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    cy.login(user);
    cy.identity();
    cy.findByRole("button", { text: /new proposal/i }).click();
    cy.findByTestId("proposal name", { timeout: 10000 }).type(
      "testing proposal 123"
    );
    cy.findByTestId("text-area").type("this is a nice description!");
    cy.findByText(/submit/i).click();
  });
});
