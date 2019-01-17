var API_PATH = require('../../common/const.js').API_PATH;

module.exports = function (app, model) {
  app.post(API_PATH.LOGIN,(req, res) => LOGIN (model,req, res));
  app.post(API_PATH.CHECK_ACCESS,(req,res) => CHECK_ACCESS(model,req,res));
}

function LOGIN(model,req, res) {
  model.User.login({
    username: req.body.username,
    password: req.body.password
  }, function (err, token) {
    if (err) {
      return res.status(err.statusCode).send(err.code);
    }

    model.User.findById(token.userId, (err, user) => {
      if (err) {
        return res.status(err.statusCode).send(err.code);
      }
      res.send({
        token: token.id,
        ttl: token.ttl,
        lang: user.lang,
        userId: user.id
      })
    })
    return;
  });
};

function CHECK_ACCESS(model,req, res) {
  let error = {
    statusCode: 401,
    name: "Error",
    message: "Authorization Required",
    code: "AUTHORIZATION_REQUIRED"
  }
  if (!req.body.tokenId) {
    return res.status(error.statusCode).send(error);
  }
  model.AccessToken.findById(req.body.tokenId, function (err, token) {
    if (err || !token) {
      return res.status(error.statusCode).send(error);
    }
    res.status(200).send({
      isAuth: true
    })
    return;
  });
}


