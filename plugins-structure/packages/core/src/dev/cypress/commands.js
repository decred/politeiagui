Cypress.Commands.add(
  "mockResponse",
  (routeMatcher, mockFn, { headers = {}, statusCode = 200 } = {}) => {
    if (!routeMatcher) return;
    return cy.intercept(routeMatcher, (req) => {
      const params = req.body || {};
      const body = mockFn(params);
      req.reply({ body, headers, statusCode });
    });
  }
);
