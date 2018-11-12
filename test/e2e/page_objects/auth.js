// The pageObject is prepared but we currently can't logout with the mock

const Commands = {
  logout: function() {
    return this.waitForElementVisible("@dropdownButton", 10000)
      .click("@dropdownButton")
      .waitForElementVisible("@logoutButton", 10000)
      .click("@logoutButton")
      .waitForElementVisible("@logoutPage", 10000)
      .waitForElementVisible("@signupLoginLink", 10000);
  },
  goToLoginSignupPage: function() {
    return this.waitForElementVisible("@signupLoginLink", 10000)
      .click("@signupLoginLink")
      .waitForElementVisible("@signupLoginPage", 10000);
  },
  loginWithErrorAllFieldsRequired: function() {
    return this.waitForElementVisible("@signupLoginPage", 10000)
      .clearValue("@loginInputEmail")
      .clearValue("@loginInputPassword")
      .setValue("@loginInputEmail", "test@test.com")
      .click("@loginSubmitButton")
      .waitForElementVisible("@error", 10000);
  },
  loginWithErrorInvalidEmailAddress: function() {
    return this.waitForElementVisible("@signupLoginPage", 10000)
      .clearValue("@loginInputEmail")
      .setValue("@loginInputEmail", "test")
      .clearValue("@loginInputPassword")
      .setValue("@loginInputPassword", "test")
      .click("@loginSubmitButton")
      .waitForElementVisible("@error", 10000);
  },
  login: function() {
    return this.waitForElementVisible("@signupLoginPage", 10000)
      .clearValue("@loginInputEmail")
      .setValue("@loginInputEmail", "test@test.com")
      .clearValue("@loginInputPassword")
      .setValue("@loginInputPassword", "test")
      .click("@loginSubmitButton")
      .waitForElementVisible("@loggedInAsEmail", 10000);
  },
  signupWithErrorAllFieldsRequired: function() {
    return this.waitForElementVisible("@signupLoginPage", 10000)
      .clearValue("@signupInputEmail")
      .clearValue("@signupInputPassword")
      .clearValue("@signupInputPasswordVerify")
      .setValue("@signupInputEmail", "test@test.com")
      .click("@signupSubmitButton")
      .waitForElementVisible("@error", 10000);
  },
  signupWithErrorInvalidEmailAddress: function() {
    return this.waitForElementVisible("@signupLoginPage", 10000)
      .clearValue("@signupInputEmail")
      .setValue("@signupInputEmail", "test")
      .clearValue("@signupInputPassword")
      .setValue("@signupInputPassword", "test")
      .click("@signupSubmitButton")
      .waitForElementVisible("@error", 10000);
  },
  signupWithErrorPasswordNotMatch: function() {
    return this.waitForElementVisible("@signupLoginPage", 10000)
      .clearValue("@signupInputEmail")
      .setValue("@signupInputEmail", "test")
      .clearValue("@signupInputPassword")
      .setValue("@signupInputPassword", "test")
      .clearValue("@signupInputPasswordVerify")
      .setValue("@signupInputPasswordVerify", "test2")
      .click("@signupSubmitButton")
      .waitForElementVisible("@error", 15000);
  },
  signupWithErrorMinPasswordLength: function() {
    return this.waitForElementVisible("@signupLoginPage", 10000)
      .clearValue("@signupInputEmail")
      .setValue("@signupInputEmail", "test")
      .clearValue("@signupInputPassword")
      .setValue("@signupInputPassword", "test")
      .clearValue("@signupInputPasswordVerify")
      .setValue("@signupInputPasswordVerify", "test")
      .click("@signupSubmitButton")
      .waitForElementVisible("@error", 10000);
  },
  /**
   * TODO: Can't test it more with the /me
   * eg: the signup process call the /me mock endpoint to get the CSRF token
   * the /me mock endpoint always return an user
   */
  signup: function() {
    return this.waitForElementVisible("@signupLoginPage", 10000)
      .clearValue("@signupInputEmail")
      .setValue("@signupInputEmail", "test@test.com")
      .clearValue("@signupInputPassword")
      .setValue("@signupInputPassword", "validpwdtest")
      .clearValue("@signupInputPasswordVerify")
      .setValue("@signupInputPasswordVerify", "validpwdtest")
      .click("@signupSubmitButton")
      .waitForElementVisible("@signupSuccess", 10000);
  }
};

module.exports = {
  commands: [Commands],
  url: function() {
    return this.api.launchUrl;
  },
  elements: {
    dropdownButton: ".dropdown-trigger",
    logoutButton: ".logout-button",
    logoutPage: ".page.logout-page",
    signupLoginLink: ".login-required",
    signupLoginPage: "#login",
    loginInputEmail: "#login-form input[name='email']",
    loginInputPassword: "#login-form input[name='password']",
    loginSubmitButton: "#login-form button[type='submit']",
    loggedInAsEmail: "#header-right .user",
    signupInputEmail: "#register-form input[name='email']",
    signupInputPassword: "#register-form input[name='password']",
    signupInputPasswordVerify: "#register-form input[name='password_verify']",
    signupSubmitButton: "#register-form button",
    signupSuccess: ".page.signup-next-step-page",
    error: ".message-ct.message-error"
  }
};
