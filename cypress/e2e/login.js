describe("Login", () => {
  it("Can login", () => {
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    cy.visit("/");
    cy.findByText(/log in/i).click();
    cy.findByLabelText(/email/i).type(user.email);
    cy.findByLabelText(/password/i).type(user.password);
    cy.findByRole("button", { text: /login/i }).click();
    cy.assertHome();
    cy.assertLoggedInAs(user);
  });
});
