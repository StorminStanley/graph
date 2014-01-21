'use strict';

var express = require('express')
  , NedbStore = require('connect-nedb-session')(express);

module.exports = new NedbStore({ filename: 'session.db' });