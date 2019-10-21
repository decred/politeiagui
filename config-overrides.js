const path = require("path");
const { override, addWebpackAlias } = require("customize-cra");
const cspHtmlWebpackPlugin = require("csp-html-webpack-plugin");

const cspConfigPolicy = {
  "default-src": "'none'",
  "base-uri": "'self'",
  "object-src": "'none'",
  "script-src": ["'self'"],
  "style-src": ["'self'"],
  "connect-src":
    "'self' faucet.decred.org explorer.dcrdata.org testnet.dcrdata.org testnet.decred.org mainnet.decred.org",
  "manifest-src": "'self'",
  "img-src": "'self' data:",
  "font-src": "'self'"
};

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: { src: path.resolve(__dirname, "src") }
  };

  return config;
};

function addCspHtmlWebpackPlugin(config) {
  if (process.env.NODE_ENV === "production") {
    config.plugins.push(new cspHtmlWebpackPlugin(cspConfigPolicy));
  }

  return config;
}

module.exports = {
  webpack: override(
    addCspHtmlWebpackPlugin,
    addWebpackAlias({
      src: path.resolve(__dirname, "src")
    })
  )
};
