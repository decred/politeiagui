const path = require("path");
const pkgName = require("./package.json").name;

const jsRules = {
  test: /\.js?$/,
  loader: "babel-loader",
  exclude: /node_modules/,
  options: {
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-transform-runtime"],
  },
};

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    library: {
      name: pkgName + ".js",
      type: "umd",
    },
    clean: true,
  },
  module: {
    rules: [jsRules],
  },
};
