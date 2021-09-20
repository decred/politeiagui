export const middlewares = {
  setBillingStatus: ({ body = {}, statusCode = 200 } = {}) =>
    cy.intercept("/api/pi/v1/setbillingstatus", (req) =>
      req.reply({
        body,
        statusCode
      })
    )
};
