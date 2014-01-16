'use strict';
/*global describe:true, it:true, beforeEach:true*/

var expect = require('expect.js')
  , proxyquire = require('proxyquire');

describe('Timer module', function () {

  var timestamp = 1390000000000
    , timer = proxyquire('../timer.js', {
    'mech-config': {
      server: {
        collectd: {
          time : timestamp
        }
      }
    }
  });

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
      expect(timer.getSeconds()).to.be.within(timestamp / 1000, timestamp / 1000 + 1);
    });

  });
});
