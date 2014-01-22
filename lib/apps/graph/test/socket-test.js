'use strict';
/*global describe:true, it:true, beforeEach:true*/

var expect = require('expect.js')
  , EventEmitter = require('events').EventEmitter
  , sinon = require('sinon')
  ;

describe('Socket module', function () {

  var socket, conn;

  beforeEach(function () {
    socket = require('../socket.js');
    conn = new EventEmitter();

    socket.dispatcher(conn);

    conn.write = function () {};

    conn.emit('data', '{"channel":"handshake", "message": ""}');
  });

  it('should be non empty object', function () {
    expect(socket).to.be.an('object');
    expect(socket).not.to.be.empty();
  });

  describe('channels', function () {

    it('should be an object', function () {
      expect(socket).to.have.property('channels');
      expect(socket.channels).to.be.an('object');
    });

    it('should initially be empty', function () {
      expect(socket.channels).to.be.empty();
    });

  });

  describe('register', function () {
    it('should be a function', function () {
      expect(socket).to.have.property('register');
      expect(socket.register).to.be.a('function');
    });

    it('should add a command to a list of commands', function () {
      var callback = sinon.spy();

      var packet = {
        channel: 'test',
        message: 'me'
      };

      socket.register(packet.channel, callback);
      conn.emit('data', JSON.stringify(packet));

      expect(callback.calledWith(packet)).to.be(true);
    });
  });

  describe('unregister', function () {
    it('should be a function', function () {
      expect(socket).to.have.property('unregister');
      expect(socket.unregister).to.be.a('function');
    });

    it('should remove a command from a list of commands', function () {
      var callback = sinon.spy();

      var packet = {
        channel: 'test',
        message: 'me'
      };

      socket.register(packet.channel, callback);
      socket.unregister(packet.channel);
      conn.emit('data', JSON.stringify(packet));

      expect(callback.calledWith(packet)).to.be(false);
    });
  });

  describe('subscribe', function () {
    it('should be a function', function () {
      expect(socket).to.have.property('subscribe');
      expect(socket.subscribe).to.be.a('function');
    });

    it('should subscribe connection to a channel', function () {
      var callback = sinon.spy();

      var packet = {
        channel: 'test',
        message: 'me'
      };

      conn.write = callback;

      socket.subscribe(conn, packet.channel);
      socket.emit(packet.channel, packet.message);

      expect(callback.calledWith(JSON.stringify(packet))).to.be(true);
    });
  });

  describe('subscribe', function () {
    it('should be a function', function () {
      expect(socket).to.have.property('subscribe');
      expect(socket.subscribe).to.be.a('function');
    });

    it('should subscribe connection to a channel', function () {
      var callback = sinon.spy();

      var packet = {
        channel: 'test',
        message: 'me'
      };

      conn.write = callback;

      socket.subscribe(conn, packet.channel);
      socket.emit(packet.channel, packet.message);

      expect(callback.calledWith(JSON.stringify(packet))).to.be(true);
    });
  });

  describe('unsubscribe', function () {
    it('should be a function', function () {
      expect(socket).to.have.property('unsubscribe');
      expect(socket.unsubscribe).to.be.a('function');
    });

    it('should unsubscribe connection from a channel', function () {
      var callback = sinon.spy();

      var packet = {
        channel: 'test',
        message: 'me'
      };

      conn.write = callback;

      socket.subscribe(conn, packet.channel);
      socket.unsubscribe(conn, packet.channel);
      socket.emit(packet.channel, packet.message);

      expect(callback.calledWith(JSON.stringify(packet))).to.be(false);
    });
  });

  describe('dispatcher', function () {

    it('should be a function', function () {
      expect(socket).to.have.property('dispatcher');
      expect(socket.dispatcher).to.be.a('function');
    });

    it('should add send method to the object', function () {
      expect(conn).to.have.property('send');
      expect(conn.send).to.be.a('function');
    });

    it('should respond to data event', function () {
      var callback = sinon.spy();

      var packet = {
        channel: 'test',
        message: 'me'
      };

      socket.register(packet.channel, callback);
      conn.emit('data', JSON.stringify(packet));

      expect(callback.calledWith(packet)).to.be(true);
    });

    it('should respond to close event', function () {
      var callback = sinon.spy();

      var packet = {
        channel: 'test',
        message: 'me'
      };

      conn.write = callback;

      socket.subscribe(conn, packet.channel);
      conn.emit('close');
      socket.emit(packet.channel, packet.message);

      expect(callback.calledWith(JSON.stringify(packet))).to.be(false);
    });
  });

});
