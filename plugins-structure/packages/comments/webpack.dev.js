const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const plugins = [
  new HtmlWebpackPlugin({
    template: "./src/index.html",
  }),
];

const dev = {
  mode: "development",
  entry: "./src/dev/index.js",
  devtool: "inline-source-map",
  devServer: {
    port: 3006,
    historyApiFallback: { index: "" },
    proxy: {
      "/api/*": {
        target: "https://localhost:4443",
        secure: false,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
    https: true,
  },
  plugins,
};

module.exports = merge(common, dev);
