import { buildPaymentRegistration, buildPaymentPaywall } from "../generate";

const totpImage =
  "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";

const API_URL = "/api/v1/user";

export const middlewares = {
  login: ({ error } = {}) =>
    cy.intercept("/api/v1/login", (req) => {
      if (error) {
        req.reply({
          statusCode: error.statusCode,
          body: { ErrorCode: error.errorCode }
        });
      } else {
        req.continue((res) => {
          res.send(res.body);
        });
      }
    }),
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
  },
  verifytotp: ({ error } = {}) =>
    cy.intercept(`${API_URL}/verifytotp`, (req) => {
      req.reply({
        statusCode: error ? 400 : 200,
        body: error ? { ErrorCode: 79 } : null
      });
    }),
  totp: ({ error } = {}) =>
    cy.intercept(`${API_URL}/totp`, (req) => {
      req.reply({
        statusCode: error ? 400 : 200,
        body: error
          ? { ErrorCode: 77 }
          : {
              key: "EL7VKVV77OKPXGOSKB2A5K6FUIOS7TLC",
              image: totpImage
            }
      });
    }),
  users: ({ body = {}, statusCode = 200 } = {}) =>
    cy.intercept(`${API_URL}s?publickey=*`, (req) =>
      req.reply({
        body,
        statusCode
      })
    )
};
