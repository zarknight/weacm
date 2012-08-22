var crypto = require('crypto');

var md5 = this.md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

this.hashPassword = function(base, salt) {
  return md5(base + salt);
};

this.generateSalt = function() {
  return md5('zarknight-salt-base-' + Math.random());
};
