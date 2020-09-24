describe("Proposals", () => {
  it.only("Can create proposals", () => {
    cy.visit("/");
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal();
  });
});
