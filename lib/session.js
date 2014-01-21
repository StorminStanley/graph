'use strict';

var _ = require('lodash')
  , sessionStore = require('./sessionstore.js')
  ;

var Session = module.exports = function Session(id) {
  Object.defineProperty(this, 'id', { value: id });
};

Session.prototype.save = function (fn) {
  sessionStore.set(this.id, this, fn || function(){});

  return this;
};

Session.prototype.load = function (fn) {
  var self = this;
  fn = fn || function(){};
  sessionStore.get(self.id, function (err, sess) {
    if (err) {
      return fn(err);
    }
    if (!sess) {
      return fn();
    }
    self.clear();
    _.each(sess, function (e, k) {
      Object.defineProperty(self, k, {
        value: e,
        enumerable: true,
        configurable: true,
        writable: true
      });
    });
    fn(null, sess);
  });

  return this;
};

Session.prototype.clear = function () {
  _.each(this, function (e, k, l) {
    delete l[k];
  });

  return this;
};