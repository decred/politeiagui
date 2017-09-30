var http = require('http');
var connect = require('connect');
var apiMocker = require('connect-api-mocker');
var app = connect();
var restMock = apiMocker('/', 'mocks/api');
app.use(restMock);
http.createServer(app).listen(8080);
