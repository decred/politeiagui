const { resolveOwn } = require("../../utils");
const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  plugins: [
    postcssPresetEnv({
      // When developing with a linked `pi-ui`
      // Point the importFrom to the path of the linked package in your env
      // importFrom: resolveOwn("../../../../pi-ui/dist/exports.css")
      importFrom: resolveOwn("../../node_modules/pi-ui/dist/exports.css"),
    }),
  ],
};
