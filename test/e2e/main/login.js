module.exports = {
  before: browser => {
    browser.maximizeWindow();
  },

  after: browser => {
    browser.end();
  },
  "Test login": browser => {
    const page = browser.page
      .auth()
      .navigate()
      .logout();

    page.goToLoginSignupPage();

    page.loginWithErrorInvalidEmailAddress();
    page.loginWithErrorAllFieldsRequired();
    page.login();
  }
};
