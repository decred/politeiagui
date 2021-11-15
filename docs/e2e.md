# Politeia GUI - E2E Tests

## Index

1. [Setup](#setup)
2. [How to write E2E tests](#how-to-write-e2e-tests)
3. [Good Practices](#good-practices)
4. [Mock API](#mock-api)

   a. [Core Package](#core-package)

   b. [How to create a support package](#how-to-create-a-support-package)

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

However, applications are mostly not static, and you can't test them only
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
nothing but an interceptor + alias.

In order to make our codebase more scalable, we organized the support commands
and files according to the [politeia](https://github.com/decred/politeia) plugin
structure. Each plugin will have its own support files, which can extend the
core (records) support files and create custom commands. You can use the custom
commands to test the application.

### Core Package

Let's take a deeper look at the `teste2e/cypress/support/core`:

```bash
teste2e/cypress/support/core
├── api.js # mock api repliers
├── commands.js # custom plugin commands
├── generate.js # mock data generators
└── utils.js # support utils and helpers
```

#### `api.js`:

Contains all repliers for the plugin api calls. Each replier will accept one
object with two parameters: `testParams` and `requestParams`. Both describe
respectively test configuration parameters, which can be used to configure
the response to match test pre-conditions, and request data sent to the API.

Let's build some replier for the `/records/v1/inventory` call:

```javascript
import { Inventory } from "./generate";
import { stateToString } from "./utils";

export function inventoryReply({
  testParams: { amountByStatus = {}, pageLimit = 20 },
  requestParams: { state = 2, page }
}) {
  const inventory = new Inventory(amountByStatus, {
    page,
    pageLimit
  });
  return { [stateToString(state)]: inventory };
}
//...
```

> Tip: all repliers names should be followed by the `Reply` suffix, such as
> `inventoryReply`, `recordsReply`, `policyReply`...

As you can see, we are receiving `{ amountByStatus, pageLimit }` from the test
case, which describe the status and state pre-conditions to run the tests.
`{ state, page } ` is the request body object for the `/inventory` call (check
the [records api docs](https://github.com/decred/politeia/blob/7eb46182bbe319aebfa7e9a0cdad45e305dd41e0/politeiawww/api/records/v1/v1.go#L514)).

#### `commands.js`

Contains all custom cypress commands that can be used for testing the plugin
contents. See the [Cypress Docs](https://docs.cypress.io/api/cypress-api/custom-commands)
for more information about how to create custom commands.

The core package contains the custom commands that can be used by other
support plugins, and core support methods, which can be used to create custom
plugin commands, such as `createMiddleware`:

Let's build the `recordsMiddleware` command for the `records` package using
the `createMiddleware` method:

```javascript
import "@testing-library/cypress/add-commands";
import { inventoryReply, recordsReply } from "./api";
// ...
Cypress.Commands.add(
  "recordsMiddleware",
  createMiddleware({
    packageName: "records",
    repliers: {
      // the replier we just created for the records/v1/inventory call
      inventory: inventoryReply,
      // other replier for the records/v1/records call
      records: recordsReply
    },
    baseUrl: "/api/records/v1"
  })
);
```

> Tip: all middlewares names should be followed by the `Middleware` suffix, such
> as `recordsMiddleware`, `ticketvoteMiddleware`, `commentsMiddleware`...

As mentioned before, "middlewares are nothing but an interceptor + alias", so
you can access the alias using the `"{packageName}.{endpoint}"` selector.

Now, we can use the `recordsMiddleware` to intercept the `/inventory` call:

```javascript
// mytest.js
it("should fetch the inventory on records page", () => {
  // will automatically fetch the inventory
  cy.visit("/records");
  // will intercept the /records/v1/inventory call and return the mock data
  cy.recordsMiddleware("inventory", {
    amountByStatus: { authorized: 2, started: 3, unauthorized: 3 }
  });
  // wait for the call to be complete using the middleware alias.
  cy.wait("@records.inventory");
  // ...
});
```

#### `generate.js`

Contains all mock data generators for the plugin. We can generate custom data
using the [faker NPM package](https://github.com/marak/Faker.js/), which is a
poweful tool to generate random data.

Let's create a mock `Record` generator to generate custom records for our tests:

```javascript
import faker from "faker";

/**
 * Inventory instantiates a new inventory map with random tokens according to
 * the amountByStatus ({ [status]: amount }) object.
 * @param { Object } amountByStatus
 * @param { Object } { pageLimit, page }
 */
export function Inventory(amountByStatus = {}, { pageLimit = 20, page = 1 }) {
  return compose(
    reduce(
      (acc, [status, amount]) => ({
        ...acc,
        [status]: compose(
          get(page - 1),
          chunk(pageLimit),
          map(() => faker.git.shortSha().slice(0, 7)),
          range(amount)
        )(0)
      }),
      {}
    ),
    entries
  )(amountByStatus);
}
```

Usage:

```javascript
const inv = new Inventory({ public: 2, archived: 1 });
// { public: ["87fah87", "5h97h53"], archived: ["a3575ca"] }
```

> Tip: forcing generators to use the constructor pattern for our mock data is a
> good option, because we can extend the prototype and use the `instanceof`
> operator to enforce the "type ckecking". For example, we can check if some
> proposal is a record using `proposal instanceof Record` condition.

### How to create a support package

Previously, we talked about the core support package, but one of the greatest
features of our plugin extensible architecture is that you can use the core
package commands to create new custom support files. Let's build an example for
the `ticketvote` plugin and create a middleware for the
`ticketvote/v1/inventory` call.

1.  Create a new `ticketvote` folder under the `teste2e/cypress/support`
    dir including the new `api.js`, `commands.js`, `generate.js` and `utils.js`
    files. It should look like this:

    ```
    teste2e/cypress/support
    ├── core
    │   ├── api.js
    │   ├── commands.js
    │   ├── generate.js
    │   └── utils.js
    └── ticketvote
        ├── api.js
        ├── commands.js
        ├── generate.js
        └── utils.js
    ```

2.  Create the API replier for the `/inventory` request:

    ```javascript
    import { inventoryReply as recordsInventoryReply } from "../core/api";
    import { statusToString } from "./utils";

    export function inventoryReply(props, { status, ...requestParams } = {}) {
      const inventory = recordsInventoryReply(props, requestParams);
      if (status) {
        const readableStatus = statusToString(status);
        return Object.entries(inventory).reduce(
          (acc, [state, statuses]) => ({
            ...acc,
            [state]: {
              [readableStatus]: statuses[readableStatus]
            }
          }),
          {}
        );
      }
      return inventory;
    }
    ```

    Notice that we can use the same `recordsInventoryReply` as a replier to the
    `/inventory` call, but we can also extend the replier and modify it to
    whatever we want. In this case, we want to filter the inventory to match the
    request status, so we can only reply tokens for the given status, if it
    exists.

3.  Create the `ticketvote` middleware using the core `createMiddleware` method:

    ```javascript
    import "@testing-library/cypress/add-commands";
    import { createMiddleware } from "../core/commands";
    import { inventoryReply } from "./api";

    Cypress.Commands.add(
      "ticketvoteMiddleware",
      createMiddleware({
        packageName: "ticketvote",
        repliers: {
          inventory: inventoryReply
        },
        baseUrl: "/api/ticketvote/v1"
      })
    );
    ```

4.  Write the test case under `teste2e/cypress/e2e` dir:

    ```javascript
    // mytest.js
    it("should fetch the ticketvote inventory on home page", () => {
      // ticketvote page will automatically fetch the inventory
      cy.visit("/ticketvote");
      // will intercept the /ticketvote/v1/inventory call and return
      // the mock data
      cy.ticketvoteMiddleware("inventory", {
        amountByStatus: { authorized: 1, started: 1, unauthorized: 1 }
      });
      // wait for the call to be complete using the middleware alias.
      cy.wait("@ticketvote.inventory").then((response) => {
        // {
        //   vetted: {
        //     authorized: ["b5aa3b2"],
        //     started: ["ab76379"],
        //     unauthorized: ["d9a78d5"]
        //   }
        // }
      });
      // Will automatically fetch the authorized tokens
      cy.visit("/ticketvote/authorized");
      cy.wait("@ticketvote.inventory").then((response) => {
        // {
        //   vetted: {
        //     authorized: ["b5aa3b2"]
        //   }
        // }
      });
      // ...
    });
    ```

    > Tip: test cases are linked to the application, while the support packages
    > are linked to the backend structure.

5.  You can combine the `recordsMiddleware` and `ticketvoteMiddleware` to
    generate custom records for the ticketvote inventory tokens:

    ```javascript
    it("should fetch records from ticketvote inventory", () => {
      cy.ticketvoteMiddleware("inventory", {
        amountByStatus: { authorized: 1, started: 1, unauthorized: 1 }
      });
      cy.recordsMiddleware("records", { state: 2, status: 2 });

      cy.visit("ticketvote/records?tab=authorized");
      cy.findAllByTestId("record").should("have.length", 1); // OK
      cy.visit("ticketvote/records?tab=started");
      cy.findAllByTestId("record").should("have.length", 1); // OK
      cy.visit("ticketvote/records?tab=unauthorized");
      cy.findAllByTestId("record").should("have.length", 1); // OK
    });
    ```
