describe("Admin account actions", () => {
  it("Can search users", () => {
    // paid admin user with proposal credits
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.server();
    cy.route("GET", "/api/v1/users?**").as("searchUser");
    cy.login(user);
    cy.visit("/user/search");
    cy.findByTestId("search-user").type("user2");
    cy.findByRole("button", { name: /search/i }).click();
    cy.wait("@searchUser");
    cy.findByText(/user2@example.com/i).should("exist");
  });

  it("Can navigate to the user page", () => {
    // paid admin user with proposal credits
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.server();
    cy.route("GET", "/api/v1/users?**").as("searchUser");
    cy.login(user);
    cy.visit("/user/search");
    cy.findByTestId("search-user").type("user2");
    cy.findByRole("button", { name: /search/i }).click();
    cy.wait("@searchUser").then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.response.body.users).to.be.a("array", "found array of users");
      cy.route("GET", "api/v1/user/*").as("getUser");
      cy.visit(`/user/${xhr.response.body.users[0].id}`);
      cy.wait("@getUser").its("status").should("eq", 200);
      cy.findByText(xhr.response.body.users[0].id).should("exist");
    });
  });
});
