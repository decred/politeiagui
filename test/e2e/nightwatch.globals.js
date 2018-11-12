module.exports = {
  // Abord all on test fail
  abortOnAssertionFailure: true,

  // Duration between two checks
  waitForConditionPollInterval: 300,

  // Timeout duration
  waitForConditionTimeout: 1000,

  /*
   * Define if the test failed when many HTML elements are found when
   * we expect only one
   */
  throwOnMultipleElementsReturned: false,

  // Before/After Hooks of all tests
  before: next => next(),
  after: next => next(),

  // Before/After Hooks of test suites
  beforeEach: (browser, next) => next(),
  afterEach: (browser, next) => next(),

  // To customize output report
  reporter: (results, next) => next()
};
