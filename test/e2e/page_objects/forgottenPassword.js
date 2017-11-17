// The pageObject is prepared but we currently can't logout with the mock

const Commands = {
  goToPageFromSide: function() {
    return this.waitForElementVisible("@resetLinkFromSide", 3000)
      .click("@resetLinkFromSide")
      .waitForElementVisible("@forgottenPasswordPage", 3000);
  },
  goToPageFromSignupLoginPage: function() {
    return this.waitForElementVisible("@signupLoginLink", 3000)
      .click("@signupLoginLink")
      .waitForElementVisible("@signupLoginPage", 3000)
      .waitForElementVisible("@resetLinkFromSignupLoginPage", 3000)
      .click("@resetLinkFromSignupLoginPage")
      .waitForElementVisible("@forgottenPasswordPage", 3000);
  },
  resetPasswordWithErrorMalformedEmailAddress: function () {
    return this.waitForElementVisible("@forgottenPasswordPage", 3000)
      .clearValue("@inputEmail")
      .setValue("@inputEmail", "test@error.com")
      .click("@submitButton")
      .waitForElementVisible("@error", 3000);
  },
  resetPasswordWithErrorInvalidEmailAddress: function () {
    return this.waitForElementVisible("@forgottenPasswordPage", 3000)
      .clearValue("@inputEmail")
      .setValue("@inputEmail", "test")
      .click("@submitButton")
      .waitForElementVisible("@error", 3000);
  },
  resetPassword: function () {
    return this.waitForElementVisible("@forgottenPasswordPage", 3000)
      .clearValue("@inputEmail")
      .setValue("@inputEmail", "test@decred.com")
      .click("@submitButton")
      .waitForElementVisible("@forgottenPasswordNextPage", 3000);
  },
};

module.exports = {
  commands: [Commands],
  url: function () {
    return this.api.launchUrl + "/password";
  },
  elements: {
    resetLinkFromSignupLoginPage: ".reset-password-link",
    resetLinkFromSide: ".login-form.login-form-side .recover-password",
    forgottenPasswordPage: ".page.forgotten-password-page",
    forgottenPasswordNextPage: ".page.forgotten-password-next-step-page",
    signupLoginLink: ".login-required",
    signupLoginPage: "#login",
    inputEmail: ".forgotten-password-form input[name='email']",
    submitButton: ".forgotten-password-form button[type='submit']",
    error: ".message-ct.message-error"
  },
};
