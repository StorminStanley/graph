'use strict';
/*jshint newcap: false */

describe('st2-graph-graph', function() {
  var instance, scope;

  beforeEach(module('main'));

  beforeEach(module(function ($provide) {
    $provide.factory('st2GraphLayer', function () {
      var Layer = function (scope, channel, options) {
        var self = scope.$new();

        self.values = [];
        self.channel = channel;

        self.remove = function () {
          self.values = [];
        };

        self.get = function (time) {
          return time - 55;
        };

        return self;
      };

      return Layer;
    });
  }));

  beforeEach(inject(function ($injector, $rootScope, $q) {
    scope = $rootScope.$new();

    $injector.invoke(function (st2GraphGraph) {
      instance = new st2GraphGraph(scope, { title: 'graph', yAxis: false });
    });
  }));

  it('should be an object', function () {
    expect(instance).to.be.an('object');
  });

  it('should inherit from scope', function () {
    expect(instance.$parent).to.be(scope);
  });

  describe('opts', function () {
    it('should be initially set to default', function () {
      expect(instance).to.have.property('opts');
      expect(instance.opts).to.have.property('xAxis');
      expect(instance.opts.xAxis).to.be(true);
    });

    it('should be extended by constructor attribute', function () {
      expect(instance.opts).to.have.property('title');
      expect(instance.opts).to.have.property('yAxis');
      expect(instance.opts.yAxis).to.be(false);
    });
  });

  describe('layers', function () {
    it('should be an empty object', function () {
      expect(instance).to.have.property('layers');
      expect(instance.layers).to.be.an('object');
      expect(instance.layers).to.be.empty();
    });
  });

  describe('addLayer', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('addLayer');
      expect(instance.addLayer).to.be.a('function');
    });

    it('should add a layer to the graph', function () {
      instance.addLayer('channel/name.rrd/of/some/sort/');

      expect(instance.layers).to.only.have.key('channel/name.rrd/of/some/sort/');
      expect(instance.layers['channel/name.rrd/of/some/sort/']).to.be.an('object');
      expect(instance.layers['channel/name.rrd/of/some/sort/']).not.to.be.empty();
    });

    it('should throw an error when there is already a channel with that name', function () {
      instance.addLayer('channel/name.rrd/of/some/sort/');

      expect(function () {
        instance.addLayer('channel/name.rrd/of/some/sort/');
      }).to.throwError();
    });

    it('should add slash at the end of channel name when there is none', function () {
      instance.addLayer('channel/name.rrd/of/some/sort');

      expect(instance.layers).to.only.have.key('channel/name.rrd/of/some/sort/');
    });
  });

  describe('removeLayer', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('removeLayer');
      expect(instance.removeLayer).to.be.a('function');
    });

    it('should remove the layer by its name', function () {
      instance.addLayer('channel/name.rrd/of/some/sort/');
      instance.removeLayer('channel/name.rrd/of/some/sort/');

      expect(instance.layers).to.be.empty();
    });

    it('should remove the layer by reference', function () {
      instance.addLayer('channel/name.rrd/of/some/sort/');
      instance.removeLayer(instance.layers['channel/name.rrd/of/some/sort/']);

      expect(instance.layers).to.be.empty();
    });
  });

  describe('get', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('get');
      expect(instance.get).to.be.a('function');
    });

    it('should return proper value', function () {
      instance.addLayer('channel/name.rrd/of/some/sort/');
      instance.addLayer('another/channel/name.wsp');

      var result = instance.get(88);

      expect(result).to.be.an('object');
      expect(result).to.only.have.keys(['channel/name.rrd/of/some/sort/', 'another/channel/name.wsp/']);
      expect(result['channel/name.rrd/of/some/sort/']).to.be(33);
    });
  });

  describe('extrema', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('getMinTime');
      expect(instance.getMinTime).to.be.a('function');
    });

    it('should return proper values', function () {
      instance.addLayer('channel/name.rrd/of/some/sort/').layers['channel/name.rrd/of/some/sort/'].values = _.range(0, 10).map(function (e) { return [e * 1000, e]; });
      instance.addLayer('another/channel/name.wsp').layers['another/channel/name.wsp/'].values = _.range(5, 15).map(function (e) { return [e * 1001, e * 0.75]; });

      expect(instance.getMinTime()).to.be(0);
      expect(instance.getMaxTime()).to.be(14014);
      expect(instance.getMinValue()).to.be(0);
      expect(instance.getMaxValue()).to.be(10.5);
    });
  });

  describe('remove', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('remove');
      expect(instance.remove).to.be.a('function');
    });

    it('should remove all the graph layers', function () {
      instance.addLayer('channel/name.rrd/of/some/sort/');
      instance.addLayer('another/channel/name.wsp');

      instance.remove();

      expect(instance.layers).to.be.empty();
    });
  });

  describe('clone', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('clone');
      expect(instance.clone).to.be.a('function');
    });

    it('should return a copy of the graph', function () {
      instance.addLayer('channel/name.rrd/of/some/sort/');
      instance.addLayer('another/channel/name.wsp');

      var result = instance.clone();

      expect(result.opts).not.to.be(instance.opts);
      expect(result.opts).to.eql(instance.opts);
      expect(result.layers).to.be.an('object');
      expect(result.layers).to.only.have.keys(['channel/name.rrd/of/some/sort/', 'another/channel/name.wsp/']);
    });
  });
});