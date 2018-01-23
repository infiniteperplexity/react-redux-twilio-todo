'use strict';

var
  assert = require('assert'),
  expressUtils = require('../');


describe('absoluteUrl', function () {
  it('should generate url for: default port: true, proxy: false, base path: false', function () {
    var req = {
      app: {
        get: function () { return null; },
      },
      host: 'example.org',
      protocol: 'http',
      socket: {
        address: function () { return { port: 80 } }
      },
      url: 'index.html'
    };

    expressUtils.absoluteUrl()(req, null, function () {});

    assert.equal(req.absoluteUrl(), 'http://example.org/index.html');
  });

  it('should generate url for: default port: false, proxy: false, base path: false', function () {
    var req = {
      app: {
        get: function () { return null; },
      },
      host: 'example.org',
      protocol: 'http',
      socket: {
        address: function () { return { port: 81 }; }
      },
      url: 'index.html'
    };

    expressUtils.absoluteUrl()(req, null, function () {});

    assert.equal(req.absoluteUrl(), 'http://example.org:81/index.html');
  });

  it('should generate url for: default port: true, proxy: true, base path: false', function () {
    var req = {
      app: {
        get: function () { return true; },
      },
      headers: {
        'x-forwarded-proto': 'https',
        'x-forwarded-host': 'proxy.org',
        'x-forwarded-port': 82
      },
      host: 'example.org',
      protocol: 'http',
      socket: {
        address: function () { return { port: 82 }; }
      },
      url: 'index.html'
    };

    expressUtils.absoluteUrl()(req, null, function () {});

    assert.equal(req.absoluteUrl(), 'https://proxy.org:82/index.html');
  });

  it('should generate url for: default port: true, proxy: false, base path: true', function () {
    var req = {
      app: {
        get: function () { return null; },
      },
      host: 'example.org',
      protocol: 'http',
      socket: {
        address: function () { return { port: 80 }; }
      },
      url: 'index.html'
    };

    expressUtils.absoluteUrl({basePath: 'base'})(req, null, function () {});

    assert.equal(req.absoluteUrl(), 'http://example.org/base/index.html');
  });
});