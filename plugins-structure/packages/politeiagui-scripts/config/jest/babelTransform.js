const { resolveOwn } = require("../../utils");
const babelJest = require("babel-jest").default;
const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === "true") {
    return false;
  }

  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
})();

console.log("hey", resolveOwn("."));

module.exports = babelJest.createTransformer({
  plugins: [
    [require.resolve("@babel/plugin-transform-runtime")],
    // Resolve modules so we can use them on tests without mocking
    [
      "module-resolver",
      {
        alias: {
          "@politeiagui/core": resolveOwn("../core/src"),
          "@politeiagui/core/client": resolveOwn("../core/src/client"),
        },
      },
    ],
  ],
  presets: [
    [
      require.resolve("@babel/preset-react"),
      {
        runtime: hasJsxRuntime ? "automatic" : "classic",
      },
    ],
    [require.resolve("@babel/preset-env")],
  ],
  babelrc: false,
  configFile: false,
});
