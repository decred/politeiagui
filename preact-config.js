export default config => {
  config.devServer.proxy = [
    {
      path: "/api/**",
      target: "https://localhost:4443",
      secure: false,
      pathRewrite(path) {
        // common: remove first path segment: (/api/**)
        return "/" + path.replace(/^\/[^/]+\//, "");
      }
    }
  ];
};
