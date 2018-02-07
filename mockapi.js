var pem = require("pem");
var https = require("https");
var connect = require("connect");
var apiMocker = require("connect-api-mocker");
var app = connect();

pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
  app.use(function(req,res,next){
    setTimeout(next,Math.random() * 2000); // Random delay for more realistic testing
  });
  app.use(function(req, res, next) {
    res.setHeader("X-Csrf-Token", "itsafake");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Methods");
    next();
  });
  app.use(apiMocker("/", "mocks/api"));
  console.log("Mock politiawww running");
  https.createServer({
    key: keys.serviceKey,
    cert: keys.certificate
  }, app).listen(4443);
});
