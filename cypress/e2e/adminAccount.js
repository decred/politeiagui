describe("Admin account actions", () => {
  it("Can search users", () => {
    cy.visit("/");
    // paid admin user with proposal credits
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    cy.typeLogin(user);
    cy.visit("/user/search");
    cy.findByTestId("search-user").type("nonpaid");
    cy.findByRole("button", { name: /search/i }).click();
    cy.findByText(/nonpaid@example.com/i).should("exist");
  });

  it("Can navigate to the user page", () => {
    cy.visit("/");
    // paid admin user with proposal credits
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    cy.typeLogin(user);
    cy.visit("/user/search");
    cy.findByTestId("search-user").type("nonpaid");
    cy.findByRole("button", { name: /search/i }).click();
    cy.wait(2000);
    cy.findAllByRole("link").last().click();
  });
});
