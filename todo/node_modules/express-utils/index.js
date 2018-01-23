var
  path = require('path'),
  url = require('url');


module.exports = {};


module.exports.absoluteUrl = function (options) {
  if (options == null) {
    options = {};
  }

  return function (req, res, next) {
    req.absoluteUrl = function () {
      var absoluteUrl = {
        protocol: this.protocol,
        hostname: this.host,
        port: this.socket.address().port,
        pathname: this.url
      };

      if ('basePath' in options) {
        absoluteUrl.pathname = path.join(options.basePath, absoluteUrl.pathname);
      }

      // use proxy header fields?
      if (req.app.get('trust proxy')) {
        if ('x-forwarded-proto' in this.headers) {
          absoluteUrl.protocol = this.headers['x-forwarded-proto'];
        }

        if ('x-forwarded-host' in this.headers) {
          absoluteUrl.hostname = this.headers['x-forwarded-host'];
        }

        if ('x-forwarded-port' in this.headers) {
          absoluteUrl.port = this.headers['x-forwarded-port'];
        }
      }

      // ignore port if default http(s) port
      if (absoluteUrl.protocol == 'http' && absoluteUrl.port == 80) {
        absoluteUrl.port = '';
      }

      if (absoluteUrl.protocol == 'https' && absoluteUrl.port == 443) {
        absoluteUrl.port = '';
      }

      return url.format(absoluteUrl);
    };

    next();
  };
};


module.exports.defaultSessionParameters = function (parameters) {
  return function (req, res, next) {
    for (var parameter in parameters) {
      if (!(parameter in req.session)) {
        req.session[parameter] = parameters[parameter];
      }
    }

    next();
  };
};
