'use strict';
/*jshint newcap: false */

describe('st2-graph-dashboard', function() {
  var instance, scope;

  beforeEach(module('main'));

  beforeEach(module(function ($provide) {
    $provide.factory('st2GraphGraph', function () {
      var Graph = function (scope, options) {
        var self = scope.$new();

        self.layers = {};

        self.addLayer = function (channel, opts) {
          self.layers[channel] = opts;
        };

        self.remove = function () {
          self.layers = {};
        };

        return self;
      };

      return Graph;
    });
  }));

  beforeEach(inject(function ($injector, $rootScope, $q) {
    scope = $rootScope.$new();

    $injector.invoke(function (st2GraphDashboard) {
      instance = new st2GraphDashboard(scope, { from: 1, to: 2 });
    });
  }));

  it('should be an object', function () {
    expect(instance).to.be.an('object');
  });

  it('should inherit from scope', function () {
    expect(instance.$parent).to.be(scope);
  });

  describe('layers', function () {
    it('should be an empty object', function () {
      expect(instance).to.have.property('graphs');
      expect(instance.graphs).to.be.an('array');
      expect(instance.graphs).to.be.empty();
    });
  });

  describe('period', function () {
    it('should be an object', function () {
      expect(instance).to.have.property('period');
      expect(instance.period).to.be.an('object');
    });

    it('should be set by constructor attribute', function () {
      expect(instance.period).to.eql({ from: 1, to: 2 });
    });
  });

  describe('addGraph', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('addGraph');
      expect(instance.addGraph).to.be.a('function');
    });

    it('should add a graph to the dashboard', function () {
      instance.addGraph({ some: 'opts' }, [{ channel: 'Layer1', opts: 1 }, { channel: 'Layer2', opts: 2 }, { channel: 'Layer3', opts: 3 }]);

      expect(instance.graphs.length).to.be(1);
      expect(instance.graphs[0]).to.be.an('object');
      expect(instance.graphs[0]).to.have.property('layers');
      expect(instance.graphs[0].layers).to.only.have.keys(['Layer1', 'Layer2', 'Layer3']);
    });
  });

  describe('removeGraph', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('removeGraph');
      expect(instance.removeGraph).to.be.a('function');
    });

    it('should remove the graph by its name', function () {
      var graph = instance.addGraph({ some: 'opts' }, [{ channel: 'Layer1', opts: 1 }, { channel: 'Layer2', opts: 2 }, { channel: 'Layer3', opts: 3 }]);
      instance.removeGraph(graph);

      expect(instance.graphs.length).to.be(0);
      expect(graph.layers).to.be.empty();
    });
  });

  describe('event relay', function () {
    it('should relay events between initial scope and graph instance', function () {
      var callback = sinon.spy();

      instance.$on('cursormove', callback);
      scope.$emit('cursormove', true);

      expect(callback.calledOnce).to.be(true);
    });
  });

  describe('timeframeChanged event', function () {
    it('should change dashboard\'s period', function () {
      scope.$emit('timeframeChanged', 10, 5);

      expect(instance.period).to.eql({ from: 5, to: 10});
    });
  });

  describe('cursormove event', function () {
    it('should change dashboard\'s cursor', function () {
      scope.$emit('cursormove', 5);

      expect(instance.cursor).to.be(5);
    });
  });
});