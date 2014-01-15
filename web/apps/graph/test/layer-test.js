'use strict';
/*jshint newcap: false */

describe('st2-graph-layer', function() {
  var instance, scope, defer;

  var data = _.range(0, 10).map(function (e) { return [e, e]; }); //[[0, 0], [1, 1],.. [9, 9]];
  
  beforeEach(module('main'));

  beforeEach(module(function ($provide) {
    $provide.service('st2GraphService', function () {
      var id = {};

      this.on = function (channel, observer) {
        id[channel] = setTimeout(function () {
          observer(null, channel, data);
        }, 0);
      };

      this.off = function (channel) {
        clearTimeout(id[channel]);
      };

      this.send = function (channel, message, cb) {
        setTimeout(function () {
          var left = _.findIndex(data, function (e) {
            return e[0] >= message.from;
          });
          var right = _.findLastIndex(data, function (e) {
            return e[0] <= message.to;
          });
          cb(null, 'reference', data.slice(left, right));
        }, 0);
      };
    });
  }));

  beforeEach(inject(function ($injector, $rootScope, $q) {
    scope = $rootScope.$new();

    defer = $q.defer();

    $injector.invoke(function (st2GraphLayer) {
      instance = new st2GraphLayer(scope, 'channel name', { title: 'channel', type: 'area' });
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
      expect(instance.opts).to.have.property('units');
      expect(instance.opts.units).to.be('decimal');
    });

    it('should be extended by constructor attribute', function () {
      expect(instance.opts).to.have.property('title');
      expect(instance.opts).to.have.property('type');
      expect(instance.opts.type).to.be('area');
    });
  });

  describe('channel', function () {
    it('should be set by constructor', function () {
      expect(instance).to.have.property('channel');
      expect(instance.channel).to.be('channel name');
    });
  });

  describe('values', function () {
    it('should be an empty array', function () {
      expect(instance).to.have.property('values');
      expect(instance.values).to.be.an('array');
      expect(instance.values).to.be.empty();
    });
  });

  describe('subscribe', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('subscribe');
      expect(instance.subscribe).to.be.a('function');
    });

    it('should subscribe to channel', function (next) {
      var callback = sinon.spy();

      instance.subscribe();
      instance.$watch('values', callback);

      instance.$apply();

      setTimeout(function () {
        expect(callback.calledWith(data, [])).to.be(true);
        expect(instance.values).to.eql(data);
        next();
      }, 0);
    });
  });

  describe('unsubscribe', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('unsubscribe');
      expect(instance.unsubscribe).to.be.a('function');
    });

    it('should unsubscribe from channel', function (next) {
      var callback = sinon.spy();

      instance.subscribe();
      instance.$watch('values', callback);

      instance.$apply();

      instance.unsubscribe();

      setTimeout(function () {
        expect(callback.neverCalledWith(data, [])).to.be(true);
        expect(instance.values).to.be.empty();
        next();
      }, 0);
    });
  });

  describe('fetch', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('fetch');
      expect(instance.fetch).to.be.a('function');
    });

    it('should return proper values', function (next) {
      var callback = sinon.spy();

      instance.fetch(3, 7, callback);

      setTimeout(function () {
        expect(callback.calledWith(null, 'reference', data.slice(3, 7))).to.be(true);
        next();
      }, 0);
    });
  });

  describe('remove', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('remove');
      expect(instance.remove).to.be.a('function');
    });

    it('should return proper values', function (next) {
      var callback = sinon.spy();

      instance.subscribe();
      instance.$watch('values', callback);

      instance.$apply();

      setTimeout(function () {

        expect(callback.calledWith(data, [])).to.be(true);
        expect(instance.values).to.eql(data);

        instance.remove();
        instance.$apply();

        setTimeout(function () {
          expect(callback.calledWith([], data)).to.be(true);
          expect(instance.values).to.be.empty();
          next();
        }, 0);

      }, 0);
    });
  });

  describe('findClosest', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('findClosest');
      expect(instance.findClosest).to.be.a('function');
    });

    it('should return proper values', function (next) {
      instance.subscribe();
      instance.$apply();

      setTimeout(function () {
        expect(instance.findClosest(-10)).to.eql([0, 0]);
        expect(instance.findClosest(0)).to.eql([0, 0]);
        expect(instance.findClosest(5.49)).to.eql([5, 5]);
        expect(instance.findClosest(5.55)).to.eql([6, 6]);
        expect(instance.findClosest(20)).to.eql([9, 9]);
        next();
      }, 0);
    });
  });

  describe('get', function () {
    it('should be a function', function () {
      expect(instance).to.have.property('get');
      expect(instance.get).to.be.a('function');
    });

    it('should return proper values', function (next) {
      instance.subscribe();
      instance.$apply();

      setTimeout(function () {
        expect(instance.get(5.55)).to.eql(6);
        next();
      }, 0);
    });

    it('should return promise when data isn\'t avaliable yet', function () {
      instance.$parent.$parent.period = {
        from: 3,
        to: 7
      };

      instance.subscribe();
      instance.$apply();

      var deferrer = instance.get(5.55);

      expect(_.keys(deferrer)).to.eql(_.keys(defer.promise)); // need to find a better way to spot a promise
    });
  });
});