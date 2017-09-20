var apiMocker = require("connect-api-mocker");

const USE_MOCKS = true;

export default config => {
  if (USE_MOCKS) {
    config.devServer.setup = function(app) {
      app.use(function(req, res, next) {
        res.header("X-Csrf-Token", "itsafake");
        next();
      });
      app.use(apiMocker("/api", "mocks/api"));
    };
  } else {
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
  }
};
