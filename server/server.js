'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
var bodyParser = require('body-parser');
var API_PATH = require('../common/const.js').API_PATH;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.method === 'GET' && req.url !== API_PATH.LOGIN && req.url !== API_PATH.CHECK_ACCESS) {
    return next();
  }else{
    middlewareCheckToken(req, res, app.models, next);
  }
  
});

function middlewareCheckToken(req, res, model, next) {

  const tokenId = req.body.tokenId || req.get('tokenId');
  model.AccessToken.findById(tokenId, function (err, token) {
    let error = {
      statusCode: 401,
      name: "Error",
      message: "Authorization Required",
      code: "AUTHORIZATION_REQUIRED"
    }

    if (err) {
      res.status(error.statusCode).send(error);
      return next();
    }

    if (!token) {
      error.message = "Missing token"
      res.status(error.statusCode).send(error);
      return next();
    }

    req.userId = token.userId;
    return next();
  });
}

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.io = require('socket.io')(app.start());

  app.io.on('connection', socket => require('./api/socket.io')(socket, app.io));
});
