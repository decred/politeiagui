// The pageObject is prepared but we currently can't logout with the mock
const Commands = {
  changePassword: function () {
    return this.waitForElementVisible("@changePasswordPage", 3000)
      .clearValue("@inputPassword")
      .clearValue("@inputPasswordVerify")
      .setValue("@inputPassword", "Qwerty123*")
      .setValue("@inputPasswordVerify", "Qwerty123*")
      .click("@submitButton");
  },
};

module.exports = {
  commands: [Commands],
  url: function (query) {
    return this.api.launchUrl + "/user/password/reset?" + query;
  },
  elements: {
    changePasswordPage: ".password-reset-form",
    changePasswordNextPage: ".page.password-reset-next-step-page",
    inputPassword: ".password-reset-form input[name='password']",
    inputPasswordVerify: ".password-reset-form input[name='password_verify']",
    submitButton: ".password-reset-form input[type='submit']",
    error: ".message-ct.message-error"
  },
};
