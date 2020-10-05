describe("Login", () => {
  it("Can login", () => {
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    cy.typeLogin(user);
  });
});
