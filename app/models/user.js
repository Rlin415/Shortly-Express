var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',

  initialize: function(){
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(enteredPw, callback) {
    var result = false;
    var dbPassword = this.get('password');

    bcrypt.compare(enteredPw, dbPassword, function(err, res) {
      console.log('database password ', dbPassword);
      console.log('entered password ', enteredPw);
      console.log('res', res);
      callback(res);
    });

    return result;
  },

  hashPassword: function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
        .then(function (hash) {
          this.set('password', hash);
        });
  }

});

module.exports = User;
