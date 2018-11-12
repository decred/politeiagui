// The pageObject is prepared but we currently can't logout with the mock
const Commands = {
  changePassword: function() {
    return this.waitForElementVisible("@changePasswordPage", 10000)
      .clearValue("@inputPassword")
      .clearValue("@inputPasswordVerify")
      .setValue("@inputPassword", "Qwerty123*")
      .setValue("@inputPasswordVerify", "Qwerty123*")
      .click("@submitButton");
  }
};

module.exports = {
  commands: [Commands],
  url: function(query) {
    return this.api.launchUrl + "/user/password/reset?" + query;
  },
  elements: {
    changePasswordPage: ".reset-password-form",
    changePasswordNextPage: ".page.reset-password-next-step-page",
    inputPassword: ".reset-password-form input[name='newPassword']",
    inputPasswordVerify: ".reset-password-form input[name='newPasswordVerify']",
    submitButton: ".reset-password-form button[type='submit']",
    error: ".message-ct.message-error"
  }
};
