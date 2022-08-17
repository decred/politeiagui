const { resolveOwn } = require("../../utils");

module.exports = {
  plugins: [
    [
      "postcss-preset-env",
      {
        // When developing with a linked `pi-ui`
        // Point the importFrom to the path of the linked package in your env
        importFrom: resolveOwn("../../../../pi-ui/dist/exports.css")
      }
    ]
  ]
};
