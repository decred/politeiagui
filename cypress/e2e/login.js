describe("Login", () => {
  it("Can login", () => {
    cy.visit("/");
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    cy.login(user);
  });
});
