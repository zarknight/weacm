var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
  mail: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  salt: { type: String, required: true },
  role: { type: Number },
  dname: { type: String },  /* display name */
  fname: { type: String },  /* full name */
  cdate: { type: Date, default: Date.now },
  udate: { type: Date, default: Date.now }
});

User.pre('save', function(next) {
  this.udate = new Date;
  next();
});

User.statics.register = function(callback) {
  return null;
};

mongoose.model('User', User);