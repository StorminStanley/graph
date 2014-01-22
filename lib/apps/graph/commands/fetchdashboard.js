'use strict';

var socket = require('../socket.js')
  ;

var defaultDashboard = [{
  "opts": {
    "title":"us-s04.tir.example.com load",
    "yAxis":{
      "from":0
    }
  },
  "layers":[{
    "channel":"us-s04.tir.example.com/load/load.rrd/shortterm/AVERAGE",
    "opts":{
      "color":"#ffa500"
    }
  },{
    "channel":"us-s04.tir.example.com/load/load.rrd/midterm/AVERAGE",
    "opts":{
      "color":"#4ca8d7"
    }
  },{
    "channel":"us-s04.tir.example.com/load/load.rrd/longterm/AVERAGE",
    "opts":{
      "color":"#fe246c"
    }
  }]
},{
  "opts":{
    "title":"us-s05.tir.example.com load",
    "yAxis":{
      "from":0
    }
  },
  "layers":[{
    "channel":"us-s05.tir.example.com/load/load.rrd/shortterm/AVERAGE",
    "opts":{
      "color":"#ffa500"
    }
  },{
    "channel":"us-s05.tir.example.com/load/load.rrd/midterm/AVERAGE",
    "opts":{
      "color":"#4ca8d7"
    }
  },{
    "channel":"us-s05.tir.example.com/load/load.rrd/longterm/AVERAGE",
    "opts":{
      "color":"#fe246c"
    }
  }]
},{
  "opts":{
    "title":"us-s06.tir.example.com load",
    "yAxis":{
      "from":0
    }
  },
  "layers":[{
    "channel":"us-s06.tir.example.com/load/load.rrd/shortterm/AVERAGE",
    "opts":{
      "color":"#ffa500"
    }
  },{
    "channel":"us-s06.tir.example.com/load/load.rrd/midterm/AVERAGE",
    "opts":{
      "color":"#4ca8d7"
    }
  },{
    "channel":"us-s06.tir.example.com/load/load.rrd/longterm/AVERAGE",
    "opts":{
      "color":"#fe246c"
    }
  }]
}];

socket.register('fetchdashboard', function (packet) {
  var self = this;

  self.send(packet.ref, self.session.dashboard || defaultDashboard);
});