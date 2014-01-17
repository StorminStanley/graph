"use strict";
var _ = require('lodash')
  , config = require('mech-config')
  , rrd = require('rrd')
  , timer = require('../timer.js')
  ;

// PRIVATE
// -------

// Fetch specific id for its value

var fetch = function (id, to, from) {
  return function (callback) {
    var tokens = id.split('.rrd/')
      , path = [config.server.collectd.path, tokens[0] + '.rrd'].join('/')
      , options = {
      cf: tokens[1].split('/')[1],
      start: (from || to) - 10,
      end: to - 10,
      resolution: (to - (from || to)) / 20 || 1 // works until biggest archive (less than a month)
    };

    rrd.fetch(path, options, function (err, data) {
      if (err) {
        console.warn('Warning:', err);
        callback(null);
      } else {
        if (_.some(data[data.length - 1], function (e) {
          return _.isNaN(e);
        })) {
          data.pop();
        }
        
        if (from) {
          callback(null, data.map(function (e) {
            return e && [e._time, e[tokens[1].split('/')[0]]];
          }));
        } else {
          callback(null, data[0] && [[data[0]._time, data[0][tokens[1].split('/')[0]]]]);
        }
      }
    });
  };
};

// PUBLIC
// ------

var selector = function (path) {
  var keys = path.split('.rrd/');
  return keys.length > 1;
};

var fetchLast = function (channel, cb) {
  fetch(channel, timer.getSeconds())(cb);
};

var fetchPeriod = function (channel, period, cb) {
  if (!cb) {
    cb = period;
    period = {
      from: timer.getSeconds() - 300,
      to: timer.getSeconds()
    };
  }
  
  if (period.to < period.from) {
    throw new Error('Period\'s From should be less than To');
  }
  
  fetch(channel, period.to, period.from)(cb);
};

var suggest = function (path, cb) {
  var tokens = path.split('.rrd/');
  
  rrd.info([config.server.collectd.path, tokens[0] + '.rrd'].join('/'), function (info) {
    
    var virtual = tokens[1];
    
    var sources = _(info).keys().filter(function (e) {
      return e.match(/ds\[(\w+)\].*/);
    }).map(function (e) {
      return e.replace(/ds\[(\w+)\].*/, '$1');
    }).uniq().value();
    
    if (!virtual) {
      cb(sources);
    } else {
      var keys = virtual.split('/');
      
      if (sources.indexOf(keys[0]) !== -1) {
        var aggregates = _(info).keys().filter(function (e) {
          return e.match(/.cf$/);
        }).map(function (e) {
          return info[e];
        }).uniq().value();
        
        if (keys.length <= 2) {
          cb(aggregates);
        } else {
          cb();
        }
      } else {
        cb();
      }
    }

  });
};

module.exports = {
  selector: selector,
  fetchLast: fetchLast,
  fetchPeriod: fetchPeriod,
  suggest: suggest
};