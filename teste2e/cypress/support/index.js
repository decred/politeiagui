// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import @testing-library/cypress commands:
import "@testing-library/cypress/add-commands";
// Import commands.js using ES2015 syntax:
import "./commands";
import "./core/commands";
import "./ticketvote/commands";
import "./users/commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(function useProposalsMiddlewares() {
  cy.middleware("www.policy");
  cy.middleware("comments.policy");
  cy.middleware("pi.policy");
  cy.middleware("ticketvote.policy");
  cy.middleware("www.api");
  cy.useRecordsApi();
});
