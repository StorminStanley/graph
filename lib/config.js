'use strict';

var config = require('mech-config');

/**
 * Config Info Interface
 */

module.exports = function (req, res) {
  res.json(config.client);
};