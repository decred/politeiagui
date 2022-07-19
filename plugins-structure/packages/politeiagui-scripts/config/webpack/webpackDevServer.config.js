module.exports = {
  port: 3000,
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
  server: "https",
};
