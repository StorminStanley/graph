'use strict';
/*jshint bitwise:false */
/*global describe:true, it:true, beforeEach:true*/

var expect = require('expect.js');

describe('Timer module', function () {

  var timestamp = new Date() - 10000
    , timer = require('../timer.js');

  it('should be non empty object', function () {
    expect(timer).to.be.an('object');
    expect(timer).not.to.be.empty();
  });

  describe('now', function () {

    it('should be a function', function () {
      expect(timer).to.have.property('now');
      expect(timer.now).to.be.a('function');
    });

    it('should return proper value', function () {
      expect(timer.now()).to.be.within(timestamp, timestamp + 1000);
    });

  });

  describe('getSeconds', function () {

    it('should be a function', function () {
      expect(timer).to.have.property('getSeconds');
      expect(timer.getSeconds).to.be.a('function');
    });

    it('should return proper value', function () {
      expect(timer.getSeconds()).to.be.within(timestamp / 1000 | 0, timestamp / 1000 | 0 + 1);
    });

  });
});
