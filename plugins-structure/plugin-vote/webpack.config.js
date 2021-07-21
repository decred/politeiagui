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
    port: 3002,
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
      name: "plugin-vote",
      filename: "remoteEntry.js",
      remotes: {
        records: "records@https://localhost:3001/remoteEntry.js",
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
          requiredVersion: require("@politeiagui/shared/package").version,
        },
        "@politeiagui/shared-hooks": {
          import: "@politeiagui/shared-hooks",
          requiredVersion: require("@politeiagui/shared-hooks/package").version,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};