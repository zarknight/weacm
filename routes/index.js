exports.init = function(app) {

  [ 'filters', 'home', 'tweet', 'chat' ].forEach(function(n) {
    require('./' + n).init(app);
  });

};
