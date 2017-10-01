var pem = require("pem");
var https = require("https");
var connect = require("connect");
var apiMocker = require("connect-api-mocker");
var app = connect();
var restMock = apiMocker("/", "mocks/api");

pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
  app.use(restMock);
  console.log("Mock politiawww running");
  https.createServer({
    key: keys.serviceKey,
    cert: keys.certificate
  }, app).listen(4443);
});
