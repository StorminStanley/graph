'use strict';
/*global describe:true, it:true, beforeEach:true*/

var expect = require('expect.js');

describe('Config module', function () {

  var config = require('../lib/config.js')
    , res = function (callback) {
        return { json: callback };
      }
    , req = null;

  it('should be a function', function () {
    expect(config).to.be.a('function');
  });
  
  it('should return non empty object', function (next) {
    var expected = function (data) {
      expect(data).to.be.an('object');
      expect(data).not.to.be.empty();
      next();
    };
    
    config(req, res(expected), next);
  });

  it('should return correct data', function (next) {
    var expected = function (data) {
      expect(data).to.have.property('test');
      expect(data.test).to.be(true);
      next();
    };
    
    config(req, res(expected), next);
  });

});
