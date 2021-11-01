const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const dev = {
  mode: "development",
  entry: "./src/index.js",
  devtool: "inline-source-map",
  devServer: {
    port: __PORT__,
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
};

module.exports = merge(common, dev);
