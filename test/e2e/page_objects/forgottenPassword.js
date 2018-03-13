// The pageObject is prepared but we currently can't logout with the mock
const GLOBAL_TIMEOUT = require("../constants").GLOBAL_TIMEOUT;
const Commands = {
  goToPageFromSide: function() {
    return this.waitForElementVisible("@resetLinkFromSide", GLOBAL_TIMEOUT)
      .click("@resetLinkFromSide")
      .waitForElementVisible("@forgottenPasswordPage", GLOBAL_TIMEOUT);
  },
  goToPageFromSignupLoginPage: function() {
    return this.waitForElementVisible("@signupLoginLink", GLOBAL_TIMEOUT)
      .click("@signupLoginLink")
      .waitForElementVisible("@signupLoginPage", GLOBAL_TIMEOUT)
      .waitForElementVisible("@resetLinkFromSignupLoginPage", GLOBAL_TIMEOUT)
      .click("@resetLinkFromSignupLoginPage")
      .waitForElementVisible("@forgottenPasswordPage", GLOBAL_TIMEOUT);
  },
  resetPasswordWithErrorMalformedEmailAddress: function () {
    return this.waitForElementVisible("@forgottenPasswordPage", GLOBAL_TIMEOUT)
      .clearValue("@inputEmail")
      .setValue("@inputEmail", "test@error.com")
      .click("@submitButton")
      .waitForElementVisible("@error", GLOBAL_TIMEOUT);
  },
  resetPasswordWithErrorInvalidEmailAddress: function () {
    return this.waitForElementVisible("@forgottenPasswordPage", GLOBAL_TIMEOUT)
      .clearValue("@inputEmail")
      .setValue("@inputEmail", "test")
      .click("@submitButton")
      .waitForElementVisible("@error", GLOBAL_TIMEOUT);
  },
  resetPassword: function () {
    return this.waitForElementVisible("@forgottenPasswordPage", GLOBAL_TIMEOUT)
      .clearValue("@inputEmail")
      .setValue("@inputEmail", "test@decred.com")
      .click("@submitButton")
      .waitForElementVisible("@forgottenPasswordNextPage", GLOBAL_TIMEOUT);
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
