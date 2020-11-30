module.exports = {
  plugins: ["eslint-plugin-cypress"],
  extends: ["plugin:cypress/recommended"],
  env: { "cypress/globals": true },
  root: true,
  rules: {
    "cypress/no-unnecessary-waiting": 0,
    "no-unused-vars": 0
  }
};
