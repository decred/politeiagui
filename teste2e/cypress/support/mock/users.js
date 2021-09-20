import { buildPaymentRegistration, buildPaymentPaywall } from "../generate";

const API_URL = "/api/v1/user";

export const middlewares = {
  payments: {
    registration: () =>
      cy.intercept(`${API_URL}/payments/registration`, (req) => {
        const registration = buildPaymentRegistration();
        req.reply({ body: registration });
      }),
    paywall: () =>
      cy.intercept(`${API_URL}/payments/paywall`, (req) => {
        const paywall = buildPaymentPaywall();
        req.reply({ body: paywall, statusCode: 200 });
      })
  }
};
