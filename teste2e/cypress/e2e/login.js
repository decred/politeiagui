describe("Login", () => {
  it("Can login", () => {
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.typeLogin(user);
  });
});
