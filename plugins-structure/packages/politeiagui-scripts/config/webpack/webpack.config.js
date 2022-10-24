const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { resolveApp, resolveOwn } = require("../../utils");
const plugins = (isEnvDevelopment, isApp) =>
  isApp
    ? [
        new HtmlWebpackPlugin({
          template: resolveApp("./src/public/index.html")
        }),
        new CompressionPlugin({
          algorithm: "gzip",
          test: /\.js(\?.*)?$/i
        })
      ]
    : isEnvDevelopment
    ? [
        new HtmlWebpackPlugin({
          template: resolveApp("./src/dev/index.html")
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
          importLoaders: 1
        }
      },
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            config: resolveOwn("./config/postcss/postcss.config.js")
          }
        }
      }
    ]
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

module.exports = function (webpackEnv = "production", type = "app") {
  const isApp = type === "app";
  const isEnvDevelopment = webpackEnv === "development";

  return {
    entry: isApp
      ? resolveApp("./src/index.js")
      : isEnvDevelopment
      ? resolveApp("./src/dev/index.js")
      : resolveApp("./src/index.js"),
    target: ["browserslist"],
    bail: !isEnvDevelopment,
    devtool: isEnvDevelopment ? "cheap-module-source-map" : "source-map",
    mode: isEnvDevelopment ? "development" : "production",
    optimization: {
      moduleIds: "deterministic",
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /node_modules\/(?!pi-ui\/).*/,
            name: "vendors",
            chunks: "all"
          },
          // This can be your own design library.
          "pi-ui": {
            test: /node_modules\/(pi-ui\/).*/,
            name: "pi-ui",
            chunks: "all"
          }
        }
      }
    },
    output: {
      publicPath: "/",
      path: resolveApp("./dist"),
      filename: "[name].[chunkhash].bundle.js",
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
    // Uncomment to see postcss-loader warnings
    // TODO: Remove when the new solution is implemented and warning is removed
    // ignore: postcss-custom-properties: "importFrom" and "exportTo" will be removed in a future version of postcss-custom-properties.
    // We are looking for insights and anecdotes on how these features are used so that we can design the best alternative.
    // Please let us know if our proposal will work for you.
    // Visit the discussion on github for more details. https://github.com/csstools/postcss-plugins/discussions/192
    ignoreWarnings: [
      {
        module: /postcss-loader\/dist\/cjs\.js/
      }
    ],
    plugins: plugins(isEnvDevelopment, isApp)
  };
};
