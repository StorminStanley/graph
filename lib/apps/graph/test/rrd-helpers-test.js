'use strict';
/*global describe:true, it:true, beforeEach:true*/

var expect = require('expect.js')
  , proxyquire = require('proxyquire')
  , sinon = require('sinon')
  ;

describe('RRD helpers module', function () {

  var rrdhelpers = proxyquire('../helpers/rrd.js', {
    'rrd': {
      fetch: function (file, options, cb) {
        process.nextTick(function () {
          cb(null, options.start === options.end ? [{
            shortterm: 0.01,
            midterm: 0.06,
            longterm: 0.05,
            _time: 1370640000
          }] : [{
            shortterm: 0.015000000000000003,
            midterm: 0.06,
            longterm: 0.05,
            _time: 1370639980
          }, {
            shortterm: 0.01,
            midterm: 0.06,
            longterm: 0.05,
            _time: 1370639990
          }, {
            shortterm: 0.01,
            midterm: 0.06,
            longterm: 0.05,
            _time: 1370640000
          }]);
        });
      },
      info: function (file, cb) {
        process.nextTick(function () {
          cb({
            filename: '../sampledata/us-s04.tir.example.com/load/load.rrd',
            rrd_version: '0003',
            step: 10,
            last_update: 1370643555,
            header_size: 6360,
            'ds[shortterm].index': 0,
            'ds[shortterm].type': 'GAUGE',
            'ds[shortterm].minimal_heartbeat': 20,
            'ds[shortterm].min': 0,
            'ds[shortterm].max': 100,
            'ds[shortterm].last_ds': '0.000000',
            'ds[shortterm].value': 0,
            'ds[shortterm].unknown_sec': 0,
            'ds[midterm].index': 1,
            'ds[midterm].type': 'GAUGE',
            'ds[midterm].minimal_heartbeat': 20,
            'ds[midterm].min': 0,
            'ds[midterm].max': 100,
            'ds[midterm].last_ds': '0.030000',
            'ds[midterm].value': 0.15,
            'ds[midterm].unknown_sec': 0,
            'ds[longterm].index': 2,
            'ds[longterm].type': 'GAUGE',
            'ds[longterm].minimal_heartbeat': 20,
            'ds[longterm].min': 0,
            'ds[longterm].max': 100,
            'ds[longterm].last_ds': '0.050000',
            'ds[longterm].value': 0.25,
            'ds[longterm].unknown_sec': 0,
            'rra[0].cf': 'AVERAGE',
            'rra[0].rows': 1200,
            'rra[0].cur_row': 789,
            'rra[0].pdp_per_row': 1,
            'rra[0].xff': 0.1,
            'rra[0].cdp_prep[0].value': NaN,
            'rra[0].cdp_prep[0].unknown_datapoints': 0,
            'rra[0].cdp_prep[1].value': NaN,
            'rra[0].cdp_prep[1].unknown_datapoints': 0,
            'rra[0].cdp_prep[2].value': NaN,
            'rra[0].cdp_prep[2].unknown_datapoints': 0,
            'rra[1].cf': 'MIN',
            'rra[1].rows': 1200,
            'rra[1].cur_row': 273,
            'rra[1].pdp_per_row': 1,
            'rra[1].xff': 0.1,
            'rra[1].cdp_prep[0].value': NaN,
            'rra[1].cdp_prep[0].unknown_datapoints': 0,
            'rra[1].cdp_prep[1].value': NaN,
            'rra[1].cdp_prep[1].unknown_datapoints': 0,
            'rra[1].cdp_prep[2].value': NaN,
            'rra[1].cdp_prep[2].unknown_datapoints': 0,
            'rra[2].cf': 'MAX',
            'rra[2].rows': 1200,
            'rra[2].cur_row': 118,
            'rra[2].pdp_per_row': 1,
            'rra[2].xff': 0.1,
            'rra[2].cdp_prep[0].value': NaN,
            'rra[2].cdp_prep[0].unknown_datapoints': 0,
            'rra[2].cdp_prep[1].value': NaN,
            'rra[2].cdp_prep[1].unknown_datapoints': 0,
            'rra[2].cdp_prep[2].value': NaN,
            'rra[2].cdp_prep[2].unknown_datapoints': 0,
          });
        });
      }
    }
  });

  it('should be non empty object', function () {
    expect(rrdhelpers).to.be.an('object');
    expect(rrdhelpers).not.to.be.empty();
  });

  describe('selector', function () {

    it('should be a function', function () {
      expect(rrdhelpers).to.have.property('selector');
      expect(rrdhelpers.selector).to.be.a('function');
    });

    it('should return proper value', function () {
      expect(rrdhelpers.selector('us-s04.tir.example.com/load/load')).to.be(false);
      expect(rrdhelpers.selector('us-s04.tir.example.com/load/load.rrd')).to.be(false);
      expect(rrdhelpers.selector('us-s04.tir.example.com/load/load.rrd/')).to.be(true);
      expect(rrdhelpers.selector('us-s04.tir.example.com/load/load.rrd/short')).to.be(true);
      expect(rrdhelpers.selector('us-s04.tir.example.com/load/load.rrd/shortterm/AVERAGE')).to.be(true);
    });

  });

  describe('fetchLast', function () {

    it('should be a function', function () {
      expect(rrdhelpers).to.have.property('fetchLast');
      expect(rrdhelpers.fetchLast).to.be.a('function');
    });

    it('should return proper value', function (next) {
      var callback = sinon.spy();

      rrdhelpers.fetchLast('us-s04.tir.example.com/load/load.rrd/shortterm/AVERAGE/', callback);

      process.nextTick(function () {
        expect(callback.firstCall.args).to.eql([ null, [ [ 1370640000, 0.01 ] ] ]);
        next();
      });
    });

  });

  describe('fetchPeriod', function () {

    it('should be a function', function () {
      expect(rrdhelpers).to.have.property('fetchPeriod');
      expect(rrdhelpers.fetchPeriod).to.be.a('function');
    });

    it('should return proper value', function (next) {
      var callback = sinon.spy();

      rrdhelpers.fetchPeriod('us-s04.tir.example.com/load/load.rrd/shortterm/AVERAGE/', callback);

      process.nextTick(function () {
        expect(callback.firstCall.args).to.eql([
          null, [[
            1370639980, 0.015000000000000003
          ], [
            1370639990, 0.01
          ], [
            1370640000, 0.01
          ]]
        ]);
        next();
      });
    });

    it('should throw an error when period.from is bigger than period.to', function () {
      var callback = sinon.spy();

      expect(function () {
        rrdhelpers.fetchPeriod('us-s04.tir.example.com/load/load.rrd/shortterm/AVERAGE/', { to: 90, from: 100}, callback);
      }).to.throwError();
    });

  });

  describe('suggest', function () {

    it('should be a function', function () {
      expect(rrdhelpers).to.have.property('suggest');
      expect(rrdhelpers.suggest).to.be.a('function');
    });

    it('should return proper value', function (next) {
      var callback = sinon.spy();

      rrdhelpers.suggest('us-s04.tir.example.com/load/load.rrd/', callback);
      rrdhelpers.suggest('us-s04.tir.example.com/load/load.rrd/short', callback);
      rrdhelpers.suggest('us-s04.tir.example.com/load/load.rrd/shortterm/', callback);

      process.nextTick(function () {
        expect(callback.firstCall.args).to.eql([ [ 'shortterm', 'midterm', 'longterm' ] ]);
        expect(callback.secondCall.args).to.eql([]);
        expect(callback.thirdCall.args).to.eql([ [ 'AVERAGE', 'MIN', 'MAX' ] ]);
        next();
      });
    });

  });

});
