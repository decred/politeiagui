// The pageObject is prepared but we currently can't logout with the mock
const GLOBAL_TIMEOUT = require("../constants").GLOBAL_TIMEOUT;
const Commands = {
  logout: function() {
    return this.waitForElementVisible("@dropdownButton", GLOBAL_TIMEOUT)
      .click("@dropdownButton")
      .waitForElementVisible("@logoutButton", GLOBAL_TIMEOUT)
      .click("@logoutButton")
      .waitForElementVisible("@logoutPage", GLOBAL_TIMEOUT)
      .waitForElementVisible("@signupLoginLink", GLOBAL_TIMEOUT);
  },
  goToLoginSignupPage: function() {
    return this.waitForElementVisible("@signupLoginLink", GLOBAL_TIMEOUT)
      .click("@signupLoginLink")
      .waitForElementVisible("@signupLoginPage", GLOBAL_TIMEOUT);
  },
  loginWithErrorAllFieldsRequired: function () {
    return this.waitForElementVisible("@signupLoginPage", GLOBAL_TIMEOUT)
      .clearValue("@loginInputEmail")
      .clearValue("@loginInputPassword")
      .setValue("@loginInputEmail", "test@test.com")
      .click("@loginSubmitButton")
      .waitForElementVisible("@error", GLOBAL_TIMEOUT);
  },
  loginWithErrorInvalidEmailAddress: function () {
    return this.waitForElementVisible("@signupLoginPage", GLOBAL_TIMEOUT)
      .clearValue("@loginInputEmail")
      .setValue("@loginInputEmail", "test")
      .clearValue("@loginInputPassword")
      .setValue("@loginInputPassword", "test")
      .click("@loginSubmitButton")
      .waitForElementVisible("@error", GLOBAL_TIMEOUT);
  },
  login: function () {
    return this.waitForElementVisible("@signupLoginPage", GLOBAL_TIMEOUT)
      .clearValue("@loginInputEmail")
      .setValue("@loginInputEmail", "test@test.com")
      .clearValue("@loginInputPassword")
      .setValue("@loginInputPassword", "test")
      .click("@loginSubmitButton")
      .waitForElementVisible("@loggedIn", GLOBAL_TIMEOUT);
  },
  signupWithErrorAllFieldsRequired: function () {
    return this.waitForElementVisible("@signupLoginPage", GLOBAL_TIMEOUT)
      .clearValue("@signupInputEmail")
      .clearValue("@signupInputPassword")
      .clearValue("@signupInputPasswordVerify")
      .setValue("@signupInputEmail", "test@test.com")
      .click("@signupSubmitButton")
      .waitForElementVisible("@error", GLOBAL_TIMEOUT);
  },
  signupWithErrorInvalidEmailAddress: function () {
    return this.waitForElementVisible("@signupLoginPage", GLOBAL_TIMEOUT)
      .clearValue("@signupInputEmail")
      .setValue("@signupInputEmail", "test")
      .clearValue("@signupInputPassword")
      .setValue("@signupInputPassword", "test")
      .click("@signupSubmitButton")
      .waitForElementVisible("@error", GLOBAL_TIMEOUT);
  },
  signupWithErrorPasswordNotMatch: function () {
    return this.waitForElementVisible("@signupLoginPage", GLOBAL_TIMEOUT)
      .clearValue("@signupInputEmail")
      .setValue("@signupInputEmail", "test")
      .clearValue("@signupInputPassword")
      .setValue("@signupInputPassword", "test")
      .clearValue("@signupInputPasswordVerify")
      .setValue("@signupInputPasswordVerify", "test2")
      .click("@signupSubmitButton")
      .waitForElementVisible("@error", GLOBAL_TIMEOUT);
  },
  /**
   * TODO: Can't test it more with the /me
   * eg: the signup process call the /me mock endpoint to get the CSRF token
   * the /me mock endpoint always return an user
   */
  signup: function () {
    return this.waitForElementVisible("@signupLoginPage", GLOBAL_TIMEOUT)
      .clearValue("@signupInputEmail")
      .setValue("@signupInputEmail", "test@test.com")
      .clearValue("@signupInputPassword")
      .setValue("@signupInputPassword", "test")
      .clearValue("@signupInputPasswordVerify")
      .setValue("@signupInputPasswordVerify", "test")
      .click("@signupSubmitButton")
      .waitForElementVisible("@loggedIn", GLOBAL_TIMEOUT);
  },
};

module.exports = {
  commands: [Commands],
  url: function() {
    return this.api.launchUrl;
  },
  elements: {
    logoutButton: ".logout-button",
    logoutPage: ".page.logout-page",
    signupLoginLink: ".login-required",
    signupLoginPage: "#login",
    loginInputEmail: "#login-form input[name='email']",
    loginInputPassword: "#login-form input[name='password']",
    loginSubmitButton: "#login-form button[type='submit']",
    loggedIn: "#header-bottom-right .user",
    signupInputEmail: "#register-form input[name='email']",
    signupInputPassword: "#register-form input[name='password']",
    signupInputPasswordVerify: "#register-form input[name='password_verify']",
    signupSubmitButton: "#register-form button",
    signupSuccess: ".page.signup-next-step-page",
    error: ".message-ct.message-error"
  }
};
