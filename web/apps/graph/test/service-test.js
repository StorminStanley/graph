'use strict';
/*jshint newcap: false */

describe('st2-graph-service', function() {
  var service, scope;

  beforeEach(module('main'));

  beforeEach(function () {
    SockJS = function () {
      var self = this;

      self.send = function (message) {
        var packet = JSON.parse(message);
        setTimeout(function () {
          if (!packet.ref) {
            self.onmessage({ data: message });
          } else {
            var container = {
              channel: packet.ref,
              message: packet.message
            };
            self.onmessage({ data: JSON.stringify(container) });
          }
        }, 0);
      };

      setTimeout(function () {
        self.onopen();
        self.onmessage({ data: '{"channel": "handshake", "message": "test"}'});
      }, 0);
    };
  });

  beforeEach(inject(function ($injector, $rootScope, $q) {
    scope = $rootScope.$new();

    $injector.invoke(function (st2GraphService) {
      service = st2GraphService;
    });
  }));

  it('should be an object', function () {
    expect(service).to.be.an('object');
  });

  describe('send & dispatcher', function () {
    it('should be a function', function () {
      expect(service).to.have.property('send');
      expect(service.send).to.be.a('function');
    });

    it('should properly route your message', function (next) {
      service.send('a', 'b');

      service.on('a', function (error, channel, message) {
        expect(error).to.be(null);
        expect(channel).to.be('a');
        expect(message).to.be('b');
        next();
      });
    });

    it('should execute callback when there is one', function (next) {
      service.send('a', 'b', function (error, channel, message) {
        expect(error).to.be(null);
        expect(message).to.be('b');
        next();
      });
    });
  });

  describe('on', function () {
    it('should be a function', function () {
      expect(service).to.have.property('on');
      expect(service.on).to.be.a('function');
    });

    it('should subscribe to channel', function (next) {
      var callback1 = sinon.spy()
        , callback2 = sinon.spy();

      service.on('a', callback1);
      service.on('a', callback2);

      service.send('a', 'b');

      setTimeout(function () {
        setTimeout(function () {
          expect(callback1.calledWith(null, 'a', 'b')).to.be(true);
          expect(callback2.calledWith(null, 'a', 'b')).to.be(true);
          next();
        }, 0);
      }, 0);
    });
  });

  describe('off', function () {
    it('should be a function', function () {
      expect(service).to.have.property('off');
      expect(service.off).to.be.a('function');
    });

    it('should unsubscribe from channel', function (next) {
      var callback1 = sinon.spy()
        , callback2 = sinon.spy();

      service.on('a', callback1);
      service.on('a', callback2);

      service.off('a');
      
      service.send('a', 'b');

      setTimeout(function () {
        setTimeout(function () {
          expect(callback1.calledWith(null, 'a', 'b')).to.be(false);
          expect(callback2.calledWith(null, 'a', 'b')).to.be(false);
          next();
        }, 0);
      }, 0);
    });

    it('should unsubscribe only specific callback when there is one', function (next) {
      var callback1 = sinon.spy()
        , callback2 = sinon.spy();

      service.on('a', callback1);
      service.on('a', callback2);

      service.off('a', callback1);

      service.send('a', 'b');

      setTimeout(function () {
        setTimeout(function () {
          expect(callback1.calledWith(null, 'a', 'b')).to.be(false);
          expect(callback2.calledWith(null, 'a', 'b')).to.be(true);
          next();
        }, 0);
      }, 0);
    });
  });
});