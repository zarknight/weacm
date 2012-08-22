exports.init = function(app) {

  app.all('/apps/*', function(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  });

  app.param('xxx', function(req, res, next, value) {
    //...
  });
  
};
