module.exports = {
  before: browser => {
    browser.maximizeWindow();
  },

  after: browser => {
    browser.end();
  },
  "Go to the forgotten password page from side": browser => {
    browser.page
      .auth()
      .navigate()
      .logout();

    browser.page.forgottenPassword().goToPageFromSide();
  },
  "Go to the forgotten password page from signup login page": browser => {
    browser.page
      .auth()
      .navigate()
      .logout();

    browser.page.forgottenPassword().goToPageFromSignupLoginPage();
  },
  "Reset password": browser => {
    browser.page.forgottenPassword().navigate();

    browser.page
      .forgottenPassword()
      .resetPasswordWithErrorMalformedEmailAddress();

    browser.page
      .forgottenPassword()
      .resetPasswordWithErrorInvalidEmailAddress();

    browser.page.forgottenPassword().resetPassword();
  }
};
