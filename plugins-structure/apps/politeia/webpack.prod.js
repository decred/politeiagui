const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const prod = {
  mode: "production",
  devtool: "source-map",
  plugins: [
    ...common.plugins,
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true,
      statsOptions: { source: false },
    }),
  ],
};

module.exports = merge(common, prod);
