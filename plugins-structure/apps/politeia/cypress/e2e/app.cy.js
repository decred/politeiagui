function errorMock() {
  return {
    errorcode: 1658261424,
  };
}
describe("Given failed app startup", () => {
  it("should display correct message when server returns an error", () => {
    cy.mockResponse("/api", errorMock, { statusCode: 500 });
    cy.visit("/");
    cy.findByTestId("politeia-error-message").should(
      "include.text",
      1658261424
    );
  });
  it("should display correct message when response error has no body", () => {
    cy.mockResponse("/api", () => {}, { statusCode: 400 });
    cy.visit("/");
    cy.findByTestId("politeia-error-message").should(
      "include.text",
      "Is politeiawww running?"
    );
  });
});
