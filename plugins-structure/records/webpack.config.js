const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const path = require("path");
const deps = require("./package.json").dependencies;
module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3001,
    proxy: {
      "/api": {
        target: "https://localhost:4443",
        secure: false,
        pathRewrite: {
          "/api": ""
        }
      }
    },
    https: true
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "records",
      filename: "remoteEntry.js",
      exposes: {
        "./RecordsList": "./src/components/RecordsList.js",
      },
      shared: {
        ...deps,
        react: {
          eager: true,
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          eager: true,
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "@politeiagui/shared": {
          import: "@politeiagui/shared",
          requiredVersion: require("../shared/package.json").version,
        },
        "@politeiagui/shared-hooks": {
          import: "@politeiagui/shared-hooks",
          requiredVersion: require("../shared-hooks/package.json").version,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};