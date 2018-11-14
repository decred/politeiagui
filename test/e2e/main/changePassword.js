module.exports = {
  before: browser => {
    browser.maximizeWindow();
  },

  after: browser => {
    browser.end();
  },
  "Go to the change password page with an invalid email": browser => {
    const uri = browser.page
      .changePassword()
      .url("email=test@error.com&verificationtoken=validtoken");

    const client = browser.page
      .changePassword()
      .navigate(uri)
      .changePassword();

    client.expect.element("@error").to.be.present.before(10000);
  },
  "Go to the change password page with an invalid token": browser => {
    const uri = browser.page
      .changePassword()
      .url("email=test@test.com&verificationtoken=invalid");

    const client = browser.page
      .changePassword()
      .navigate(uri)
      .changePassword();

    client.expect.element("@error").to.be.present.before(10000);
  },
  "Go to the change password page with an expired token": browser => {
    const uri = browser.page
      .changePassword()
      .url("email=test@test.com&verificationtoken=expired");

    const client = browser.page
      .changePassword()
      .navigate(uri)
      .changePassword();

    client.expect.element("@error").to.be.present.before(10000);
  },
  "Change password": browser => {
    const uri = browser.page
      .changePassword()
      .url("email=test@test.com&verificationtoken=validtoken");

    const client = browser.page
      .changePassword()
      .navigate(uri)
      .changePassword();

    client.expect
      .element("@changePasswordNextPage")
      .to.be.present.before(10000);
  }
};
