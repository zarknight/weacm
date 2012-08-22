exports.init = function() {

  [ 'user' ].forEach(function(n) {
    require('./' + n);
  });
  
};