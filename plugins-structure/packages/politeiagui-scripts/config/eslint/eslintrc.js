module.exports = {
  root: true,
  extends: ["react-app", "react-app/jest", "prettier"],
  plugins: ["unused-imports"],
  rules: {
    "testing-library/no-dom-import": "off",
    eqeqeq: 0,
    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true,
      },
    ],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
};
