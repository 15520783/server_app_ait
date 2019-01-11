// var PATH = require('../../common/Const').PATH;

module.exports = function (app, model) {
  app.post('/api/authen/login', function (req, res) {
    console.log(req.body);
    model.User.login({
      username: req.body.username,
      password: req.body.password
    }, function (err, token) {
      if (err) {
        return res.status(err.statusCode).send(err.code);
      }

      model.User.findById(token.userId, (err,user) =>{
        if(err) {
          return res.status(err.statusCode).send(err.code);
        }
        res.send({
          token:token.id,
          ttl: token.ttl,
          lang: user.lang,
          userId: user.id
        })
      })
      return;
    });
  });
}