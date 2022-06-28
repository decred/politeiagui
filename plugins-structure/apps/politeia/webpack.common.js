const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const jsRules = [
  {
    test: /\.js?$/,
    loader: "babel-loader",
    exclude: /node_modules/,
    options: {
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-transform-runtime"],
    },
  },
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
          modules: true,
        },
      },
    ],
    include: /\.module\.css$/,
  },
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"],
    exclude: /\.module\.css$/,
  },
];

const markdownRules = [
  {
    test: /\.md$/,
    use: "raw-loader",
  },
];

const svgRules = [
  {
    test: /\.svg$/,
    use: ["@svgr/webpack"],
  },
];

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
    rules: [...jsRules, ...cssRules, ...markdownRules, ...svgRules],
  },
  plugins,
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
};
