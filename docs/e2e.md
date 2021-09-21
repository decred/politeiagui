# Politeia GUI - E2E Tests

## Index

1. [Setup](#setup)
2. [How to write E2E tests](#how-to-write-e2e-tests)
3. [Good Practices](#good-practices)
4. [Mock API](#mock-api)

## Setup

Politeiagui has E2E tests using [`cypress`](https://www.cypress.io/) and
[`react-testing-library/cypress`](https://testing-library.com/docs/react-testing-library/intro).
Backend should be running when running e2e tests until mocked API E2E work
is complete.

Before running the e2e tests make sure to:

1.  Run `/teste2e/setup-test-users.sh` script to setup the users needed
    for the tests.
2.  Enable paywall on backend side.

There are two ways two run the e2e tests, either in terminal or in browser:

1. To run e2e tests in terminal use: `test:e2e:run`.
2. To run e2e tests in browser use: `test:e2e:browser`.

E2E Test files are located under the `/teste2e` directory.

## How to write E2E tests

E2E tests are created to simulate **user** behavior among the application. This
could be used to automate user actions, make assertions depending on the action,
create multiple cenarios that are hard to replicate on development environment,
specially regarding _ticketvote testing_, which you need to purchase tickets,
wait until they become available, and finally cast votes for some proposal.

In order to make the E2E environment completely independent from the backend, we
came up with an idea of a **Mock API Structure**, which will be described below.

## Good practices

As mentioned before, we should always focus on user actions, hence, tests should
be written in order to describe those actions. We should focus on **what users
do** instead of **what our application does**, and focus on **how does our app
behave** for some given user action.

For example, instead of just having a proposals page that displays proposals by
tabs, we should look on a user's perspective and **expect** some elements to be
displayed on the screen, such as proposals cards containing the name, date,
voting status, etc.

We likely do this a lot when coding, indeed. But tests are here to make sure
that the list is correctly displayed despite the developer actions, and if any
changes are applied on the list page, the tests should automatically detect them
if they mess up with the user expected app response.

With this in mind, a good test is the one that handles the expected application
UX for what the user is interacting with, including both successful and failed
actions.

Let's write a simple test case for our proposals list page:

```javascript
describe("Proposals List", () => {
  it("should render proposals list", () => {
    cy.visit("/");
    cy.findByTestId("proposal-title").should("be.visible");
    cy.findByTestId("proposal-date").should("be.visible");
  });
});
```

The `describe` method is used for grouping, and `it` is used for the
test case. Each test case is followed by assertions, which are used to control
the expected user behavior. As you can see, we are making 2
[assertions](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Assertions)
on our test case using the
[`should`](https://docs.cypress.io/api/commands/should) command, which accepts
[Chai chainers](https://docs.cypress.io/guides/references/assertions#Chai) as an
argument.

> Check the Cypress and Jest docs for more info.

However, the most applications are not static, and you can't test it only
visually, because users are supposed to **interact** with the platform: click
on page buttons and links, fill forms, scroll the page... Basically, if there's
a button, users will click on it.

Therefore, if we expect interactions, the application should reply to them. But
what if user actions require API responses? Should we have a backend configured
properly to run the tests? Wouldn't we be forced to create proposals first and
then run the listing tests?

## Mock API

Luckily, [Cypress](https://www.cypress.io/) has a good tool for tests: the
[`intercept` command](https://docs.cypress.io/api/commands/intercept). Which we
can use to mock the api data and manipulate the responses according to its
request data. See the [Cypress Documentation](https://docs.cypress.io/) to have
more information regarding interceptors and aliases.

Let's create a mocked API response for the `/ticketvote/v1/inventory` call. We
can manage the request object `req` to get the request params, headers, and also
manage the response (`req.reply`). Check the docs to see how to manage
[intercepted requests](https://docs.cypress.io/api/commands/intercept#Intercepted-requests)
and [intercepted responses](https://docs.cypress.io/api/commands/intercept#Intercepted-responses)

```javascript
// ============
// your-test.js
// ============
describe("Ticketvote inventory", () => {
  it("can fetch the ticketvote inventory", () => {
    cy.intercept("/api/ticketvote/v1/inventory", (req) => {
      req.reply({
        statusCode: 200, // set custom response status
        body: {
          vetted: {
            unauthorized: ["abcdefg"] // return some fake token
          }
        }
      });
    });
    // ...
    // assertions regarding the ticketvote inventory
    // ...
  });
});
```

This will intercept the `/records/v1/inventory` request and return the mocked
inventory in a 200 status response. Even if our server returned an errored
request, the cypress environment would ignore the errors and return the response
the way you specify.

However, intercept commands can be used on many different tests, hence, they
should be more generic. This is why we came up with **middlewares**, which are
nothing but an interceptor + alias. Let's see how can we use the
`/api/ticketvote/v1/inventory` interceptor as a middleware:

1. Create the middleware into our support mock file for the plugin you want.

   - In this case, we call the `ticketvote` api, so we will add it into
     `support/mock/ticketvote.js`:

   ```javascript
   export const middlewares = {
     // ...
     inventory: () =>
       cy.intercept("/api/ticketvote/v1/inventory", (req) => {
         req.reply({
           statusCode: 200, // set custom response status
           body: {
             vetted: {
               unauthorized: ["abcdefg"] // return some fake token
             }
           }
         });
       })
     // ...
   };
   ```

2. Add the bundle into the cypress custom `cy.middleware` command on
   `support/commands.js`:

   ```javascript
   import { middlewares as ticketVoteMiddlewares } from "./mock/ticketvote";

   // ...

   Cypress.Commands.add("middleware", (path, ...args) => {
     const mw = get(path)({
       ticketvote: ticketVoteMiddlewares
       // ... other middlewares
     });
     return mw(...args).as(path); // alias automatically generated
   });

   // ...
   ```

3. Now, when you want to use the middleware on your tests, you can just pass the
   query selector for the middleware you need:

   ```javascript
   // ============
   // your-test.js
   // ============
   describe("Ticketvote Inventory", () => {
     it("can fetch the ticketvote inventory", () => {
       // accessing the middleware path using the string pattern:
       cy.middleware("ticketvote.inventory");
       // ...
       // Assert request success
       cy.wait("@ticketvote.inventory").its("status").should("eq", 200);
       // ...
     });
     // ...
   });
   ```

4. Now you can test pages that call the `/ticketvote/v1/inventory` without being
   connected to the ticketvote api.

---

Let's build our proposals list page test example using the created ticketvote
inventory middleware. First, let's keep in mind that the proposals page also
requests the `api/records/v1/records` endpoint, so let's assume we have a
`records.records` middleware, which will return a random records batch for
given inventory tokens.

```javascript
describe("Proposals list", () => {
  it("should render proposals list", () => {
    // middlewares
    cy.middleware("ticketvote.inventory");
    cy.middleware("records.records");
    // user behavior
    cy.visit(`/`);
    cy.wait("@ticketvote.inventory");
    cy.wait("@records.records");
    // assert that the proposal is fetched on the list
    cy.findAllByTestId("record-title").should("have.length", 1);
    // Scroll to bottom to render more proposals
    cy.scrollTo("bottom");
    cy.wait(1000);
    // make sure no new proposals were fetched, since the inventory has only
    // one token
    cy.findAllByTestId("record-title").should("have.length", 1);
  });
});
```

Now, if we turned off the backend, the tests would still be able to render the
proposals list.
