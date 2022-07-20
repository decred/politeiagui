const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const plugins = (webpackEnv) =>
  webpackEnv === "development"
    ? [
        new HtmlWebpackPlugin({
          template: "./src/public/index.html"
        })
      ]
    : [];

const pkgName = require(resolveApp("./package.json")).name;

const jsRules = [
  {
    test: /\.js?$/,
    loader: "babel-loader",
    exclude: /node_modules/,
    options: {
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-transform-runtime"]
    }
  }
];

const cssRules = [
  {
    test: /\.css$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          modules: true
        }
      }
    ],
    include: /\.module\.css$/
  },
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"],
    exclude: /\.module\.css$/
  }
];

const markdownRules = [
  {
    test: /\.md$/,
    use: "raw-loader"
  }
];

const svgRules = [
  {
    test: /\.svg$/,
    use: ["@svgr/webpack"]
  }
];

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  return {
    entry: isEnvDevelopment
      ? resolveApp("./src/index.js")
      : resolveApp("./src/index.js"),
    target: ["browserslist"],
    bail: isEnvProduction,
    devtool: isEnvDevelopment ? "cheap-module-source-map" : "source-map",
    mode: isEnvDevelopment ? "development" : "production",
    output: {
      publicPath: "/",
      path: resolveApp(path.resolve(__dirname, "dist")),
      library: {
        name: pkgName + ".js",
        type: "umd"
      },
      clean: true
    },
    module: {
      rules: [...jsRules, ...cssRules, ...markdownRules, ...svgRules]
    },
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify")
      }
    },
    plugins: plugins(webpackEnv)
  };
};
