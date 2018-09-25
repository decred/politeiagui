// The pageObject is prepared but we currently can't logout with the mock

const Commands = {
  goToPageFromSide: function() {
    return this.waitForElementVisible("@resetLinkFromSide", 10000)
      .click("@resetLinkFromSide")
      .waitForElementVisible("@forgottenPasswordPage", 10000);
  },
  goToPageFromSignupLoginPage: function() {
    return this.waitForElementVisible("@signupLoginLink", 10000)
      .click("@signupLoginLink")
      .waitForElementVisible("@signupLoginPage", 10000)
      .waitForElementVisible("@resetLinkFromSignupLoginPage", 10000)
      .click("@resetLinkFromSignupLoginPage")
      .waitForElementVisible("@forgottenPasswordPage", 10000);
  },
  resetPasswordWithErrorMalformedEmailAddress: function () {
    return this.waitForElementVisible("@forgottenPasswordPage", 10000)
      .clearValue("@inputEmail")
      .setValue("@inputEmail", "test@error.com")
      .click("@submitButton")
      .waitForElementVisible("@error", 10000);
  },
  resetPasswordWithErrorInvalidEmailAddress: function () {
    return this.waitForElementVisible("@forgottenPasswordPage", 10000)
      .clearValue("@inputEmail")
      .setValue("@inputEmail", "test")
      .click("@submitButton")
      .waitForElementVisible("@error", 10000);
  },
  resetPassword: function () {
    return this.waitForElementVisible("@forgottenPasswordPage", 10000)
      .clearValue("@inputEmail")
      .setValue("@inputEmail", "test@decred.com")
      .click("@submitButton")
      .waitForElementVisible("@forgottenPasswordNextPage", 10000);
  }
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
  }
};
