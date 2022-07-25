module.exports = {
  port: "auto",
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
  open: true,
  server: "https",
};
