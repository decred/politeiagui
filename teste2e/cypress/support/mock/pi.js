export const middlewares = {
  setBillingStatus: ({ body = {}, statusCode = 200 } = {}) =>
    cy.intercept("/api/pi/v1/setbillingstatus", (req) =>
      req.reply({
        body,
        statusCode
      })
    ),
  summaries: ({ token, status }) =>
    cy.intercept("/api/pi/v1/summaries", (req) => {
      req.continue((res) => {
        res.body.summaries[token] = {
          status
        };
        res.send(res.body);
      });
    }),
  billingstatuschanges: ({ body = {}, statusCode = 200 } = {}) =>
    cy.intercept("/api/pi/v1/billingstatuschanges", (req) =>
      req.reply({
        body,
        statusCode
      })
    )
};
