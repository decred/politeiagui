const path = require("path");
const pkgName = require("./package.json").name;

const jsRules = {
  test: /\.js?$/,
  loader: "babel-loader",
  exclude: /node_modules/,
  options: {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: ["@babel/plugin-transform-runtime"],
  },
};

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

const svgRules = [
  {
    test: /\.svg$/,
    use: ["@svgr/webpack"],
  },
];

module.exports = {
  entry: "./src/index.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: pkgName + ".js",
      type: "umd",
    },
    clean: true,
  },
  module: {
    rules: [jsRules, ...cssRules, ...svgRules],
  },
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
};
