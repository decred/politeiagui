const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const jsRules = {
  test: /\.js?$/,
  loader: "babel-loader",
  exclude: /node_modules/,
  options: {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: ["@babel/plugin-transform-runtime"],
  },
};

const plugins = [
  new HtmlWebpackPlugin({
    template: "./src/public/index.html",
  }),
];

module.exports = {
  entry: "./src/index.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [jsRules],
  },
  plugins,
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
};
