var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.init = function(app) {
  
  app.get('/', function(req, res) {
    var user = new User;
    user.mail = "zarknight@gmail.com";
    user.pass = "123456";
    user.salt = "xxxxxx";

    user.save();
    
    res.render('index');
  });

  app.get('/logout', function(req, res) {
    req.session.destory(function(err) {
      res.redirect('/login');
    });
  });

  app.get('/login', function(req, res) {
    res.render('login');
  });

  app.post('/login', function(req, res) {

  });

};
