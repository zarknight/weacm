var tsdk = require("node-tsdk").TSDK;

var weibo = tsdk.getInstance({
  appkey: '1043137589',
  appsecret: '5dc4f6d731b08d6f9a39729bbdb24d58',
  redirect_uri: 'http://localhost:3000/weiboapp.html'
});

exports.init = function(app) {
  
  app.get('/weiboapp.html', function(req, res) {
    var code = req.query.code;
    
    weibo.getAccessTokenByCode(code, function(err, result) {
      if (err) {
        console.log('ERROR!');
      } else {
        weibo.getFriendsTimeline({
          'access_token': result.access_token
        }, function (err, result) {
          res.render('weiboapp', {
            statuses: result.statuses 
          });
        });
      }
    });
  });

};