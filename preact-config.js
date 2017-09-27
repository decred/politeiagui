var apiMocker = require("connect-api-mocker");

const USE_MOCKS = true;

export default config => {
  config.resolve.alias.react = "preact-compat";
  config.resolve.alias["react-dom"] = "preact-compat";
  config.resolve.alias["create-react-class"] = "preact-compat/lib/create-react-class";

  if (USE_MOCKS) {
    config.devServer.setup = function(app) {
      app.use(function(req,res,next){
        setTimeout(next,Math.random() * 2000); // Random delay for more realistic testing
      });
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
