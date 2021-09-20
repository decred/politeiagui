import { buildUser } from "../../support/generate";
import * as pki from "../../pki";

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
    cy.wait("@searchUser").then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.response.body.users).to.be.a("array", "found array of users");
    });
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

  it("Can activate/deactivate a user", () => {
    // admin user for login
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };

    cy.server();

    // visited routes
    cy.route("GET", "api/v1/user/*").as("getUser");
    cy.route("POST", "/api/v1/user/manage").as("manageUser");

    // search and select user
    cy.route("GET", "/api/v1/users?**").as("searchUser");
    cy.login(user);
    cy.visit("/user/search");
    cy.findByTestId("search-user").type("user2");
    cy.findByRole("button", { name: /search/i }).click();
    cy.wait("@searchUser").then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.response.body.users).to.be.a("array", "found array of users");
      cy.visit(`/user/${xhr.response.body.users[0].id}`);
      cy.wait("@getUser").its("status").should("eq", 200);
    });

    // go to accounts tab
    cy.findByTestId("tab-1").click();

    // deactivate user and confirm it succeeded
    cy.findByTestId("user-deactivate").click();
    cy.findByTestId("reason").type("broke rules");
    cy.findByTestId("reason-confirm").click();
    cy.wait("@manageUser").its("status").should("eq", 200);
    cy.wait("@getUser").its("status").should("eq", 200);
    cy.wait(1000);
    cy.findByTestId("reason-confirm-success").click();

    // reactivate user and confirm it succeeded
    cy.findByTestId("user-activate").click();
    cy.findByTestId("reason").type("pardoned");
    cy.findByTestId("reason-confirm").click();
    cy.wait("@manageUser").its("status").should("eq", 200);
    cy.wait("@getUser").its("status").should("eq", 200);
    cy.wait(1000);
    cy.findByTestId("reason-confirm-success").click();
  });

  it("Can mark user as paid", () => {
    // admin user for login
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };

    cy.server();

    // visited routes
    cy.route("GET", "api/v1/user/*").as("getUser");
    cy.route("GET", "/api/v1/users?**").as("searchUser");
    cy.route("POST", "/api/v1/user/new").as("registerUser");
    cy.route("POST", "/api/v1/user/manage").as("manageUser");

    // register random unpaid user
    let unpaidUser = buildUser();

    return pki.generateKeys().then((keys) =>
      pki.loadKeys(unpaidUser.username, keys).then(() =>
        pki.myPubKeyHex(unpaidUser.username).then((publickey) => {
          unpaidUser.publickey = publickey;
          cy.register(unpaidUser);

          // search and select user
          cy.login(user);
          cy.visit("/user/search");
          cy.findByTestId("search-user").type(unpaidUser.email);
          cy.findByRole("button", { name: /search/i }).click();
          cy.wait("@searchUser").then((xhr) => {
            expect(xhr.status).to.eq(200);
            expect(xhr.response.body.users).to.be.a(
              "array",
              "found array of users"
            );
            cy.visit(`/user/${xhr.response.body.users[0].id}`);
            cy.wait("@getUser").its("status").should("eq", 200);
          });

          // go to credits tab
          cy.findByTestId("tab-2").click();
          cy.findByTestId("mark-paid").click();
          cy.findByTestId("reason").type("paid");
          cy.findByTestId("reason-confirm").click();
          cy.wait("@manageUser").its("status").should("eq", 200);
          cy.wait("@getUser").its("status").should("eq", 200);
          cy.findByTestId("reason-confirm-success").click();
          cy.findByText(/paid/i).should("exist");
        })
      )
    );
  });

  it("Can rescan user credits", () => {
    // admin user
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };

    cy.server();

    // visited routes
    cy.route("GET", "api/v1/user/*").as("getUser");
    cy.route("GET", "/api/v1/users?**").as("searchUser");
    cy.route("PUT", "/api/v1/user/payments/rescan").as("rescanCredits");

    // search and select user
    cy.login(user);
    cy.visit("/user/search");
    cy.findByTestId("search-user").type("user3");
    cy.findByRole("button", { name: /search/i }).click();
    cy.wait("@searchUser").then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.response.body.users).to.be.a("array", "found array of users");
      cy.visit(`/user/${xhr.response.body.users[0].id}`);
      cy.wait("@getUser").its("status").should("eq", 200);
    });

    // go to credits tab and rescan
    cy.findByTestId("tab-2").click();
    cy.findByTestId("rescan-credits").click();
    cy.wait("@rescanCredits").its("status").should("eq", 200);
    cy.findByText(/user credits are up to date/i).should("exist");
  });
});
