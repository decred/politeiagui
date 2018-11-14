module.exports = {
  before: browser => {
    browser.maximizeWindow();
  },

  after: browser => {
    browser.end();
  },
  "Test signup": browser => {
    const page = browser.page
      .auth()
      .navigate()
      .logout();

    page.goToLoginSignupPage();

    page.signupWithErrorInvalidEmailAddress();
    page.signupWithErrorAllFieldsRequired();
    page.signupWithErrorPasswordNotMatch();
    page.signupWithErrorMinPasswordLength();
    page.signup();
  }
};
