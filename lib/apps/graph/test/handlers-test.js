'use strict';
/*global describe:true, it:true, beforeEach:true*/

var expect = require('expect.js')
  , proxyquire = require('proxyquire');

describe('Handlers module', function () {

  var handlers = proxyquire('../handlers.js', {
    './rrdhelpers.js': {
      '@name': 'rrd',
      selector: function (channel) {
        return 'rrd' === channel;
      }
    },
    './wsphelpers.js': {
      '@name': 'wsp',
      selector: function (channel) {
        return 'wsp' === channel;
      }
    },
  });

  it('should be non empty object', function () {
    expect(handlers).to.be.an('object');
    expect(handlers).not.to.be.empty();
  });

  describe('find', function () {

    it('should be a function', function () {
      expect(handlers).to.have.property('find');
      expect(handlers.find).to.be.a('function');
    });

    it('should return proper value', function () {
      expect(handlers.find('rrd')['@name']).to.be('rrd');
      expect(handlers.find('wsp')['@name']).to.be('wsp');
    });

  });

});
