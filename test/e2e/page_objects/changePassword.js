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
    changePasswordPage: ".reset-password-form",
    changePasswordNextPage: ".page.reset-password-next-step-page",
    inputPassword: ".reset-password-form input[name='password']",
    inputPasswordVerify: ".reset-password-form input[name='password_verify']",
    submitButton: ".reset-password-form button[type='submit']",
    error: ".message-ct.message-error"
  },
};
