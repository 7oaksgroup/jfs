(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__(0);

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = __webpack_require__(4);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(5);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

__webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middy = __webpack_require__(6);
var createErr = __webpack_require__(7);

var _require = __webpack_require__(8),
    urlEncodeBodyParser = _require.urlEncodeBodyParser,
    httpErrorHandler = _require.httpErrorHandler,
    cors = _require.cors;

var jwt = __webpack_require__(2);

var _require2 = __webpack_require__(9),
    Pool = _require2.Pool;

var pool = new Pool({
  connectionString: process.env.dbUrl
});

var databaseMiddleware = function databaseMiddleware(config) {
  return {
    before: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(handler, next) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return pool.connect();

              case 2:
                handler.context.db = _context.sent;

                next();

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function before(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }(),
    after: function after(handler, next) {
      handler.context.db.release(true);
      next();
    }
  };
};

// Should be added last in the chain (so closest on the onion)
var detectingResponseType = function detectingResponseType() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    after: function after(handler, next) {
      // handler.response has our value
      var value = handler.response;

      if (value === null) {
        value = {
          statusCode: 404,
          body: {
            message: 'Not found'
          }
        };
      } else {
        value = {
          statusCode: config.statusCode || 200,
          body: (0, _stringify2.default)(value)
        };
      }

      handler.response = value;
      next();
    }
  };
};

var curry = function curry(fn) {
  return middy(fn).use(urlEncodeBodyParser()).use(cors()).use(databaseMiddleware()).use(httpErrorHandler()).use(detectingResponseType());
};

module.exports.root = curry(function (event, context, callback) {
  callback(null, { message: 'ok' });
});

module.exports.register = curry(function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(event, context, callback) {
    var _JSON$parse, inviteCode, firstName, lastName, email, facebook_avatar, zip, friendQuery, friendResponse, friendId, registerQuery, getQuery, getResponse;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _JSON$parse = JSON.parse(event.body), inviteCode = _JSON$parse.inviteCode, firstName = _JSON$parse.firstName, lastName = _JSON$parse.lastName, email = _JSON$parse.email, facebook_avatar = _JSON$parse.facebook_avatar, zip = _JSON$parse.zip;
            friendQuery = {
              text: 'SELECT * FROM prelaunch.registration where email = $1 OR id::varchar = $1',
              values: [inviteCode]
            };
            _context2.next = 4;
            return context.db.query(friendQuery);

          case 4:
            friendResponse = _context2.sent;

            console.log(friendQuery, friendResponse);
            if (!friendResponse.rows[0]) {
              callback(createErr(400, 'Invite Code was not valid.'));
            }
            friendId = friendResponse.rows[0].id;
            registerQuery = {
              text: 'UPDATE\n      prelaunch.registration\n      SET first_name = $1, last_name = $2, email = $3, avatar_url = $4, postal_code = $5, sponsor_id = $6 \n      WHERE facebook_email = $3',
              values: [firstName, lastName, email, facebook_avatar, zip, friendId]
            };
            _context2.next = 11;
            return context.db.query(registerQuery);

          case 11:
            getQuery = {
              text: 'SELECT * FROM prelaunch.registration where email = $1',
              values: [email]
            };
            _context2.next = 14;
            return context.db.query(getQuery);

          case 14:
            getResponse = _context2.sent;


            callback(null, getResponse.rows[0]);

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());

module.exports.search = curry(function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(event, context, callback) {
    var name, searchQuery, searchResponse;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            name = event.queryStringParameters.name;
            searchQuery = {
              text: 'SELECT * FROM prelaunch.registration WHERE lower(first_name) like %$1% OR lower(last_name) %$1%',
              values: [name.toLowerCase()]
            };
            _context3.next = 4;
            return context.db.query(searchQuery);

          case 4:
            searchResponse = _context3.sent;

            callback(null, searchResponse.rows[0]);

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());

module.exports.getUser = curry(function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(event, context, callback) {
    var id, userQuery, userResponse;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = event.pathParameters.id;
            userQuery = {
              text: 'SELECT * FROM prelaunch.registration where id = $1',
              values: [id]
            };
            _context4.next = 4;
            return context.db.query(userQuery);

          case 4:
            userResponse = _context4.sent;

            callback(null, userResponse.rows[0]);

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());

module.exports.facebookFriends = curry(function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(event, context, callback) {
    var ids, facebookIds, friendQuery, friendResponse;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            ids = event.queryStringParameters.ids;
            facebookIds = ids.split(',');
            friendQuery = {
              text: 'SELECT * FROM prelaunch.registration WHERE facebook_id IN $1',
              values: [facebookIds]
            };
            _context5.next = 5;
            return context.db.query(friendQuery);

          case 5:
            friendResponse = _context5.sent;

            callback(null, friendResponse.rows);

          case 7:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());

module.exports.influence = curry(function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(event, context, callback) {
    var Authorization, token, decoded, influenceQuery, response, countResponse;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            Authorization = event.headers.Authorization;
            token = Authorization.split(' ')[1];
            decoded = jwt.verify(token, process.env.jwtKey);
            influenceQuery = {
              text: 'select d.*\n      from prelaunch.genealogy d\n      inner join prelaunch.genealogy target on target.id = $1\n      where d.path[target.depth] = target.id\n        and d.id != target.id',
              values: [decoded.id]
            };
            _context6.next = 6;
            return context.db.query(influenceQuery);

          case 6:
            response = _context6.sent;
            _context6.next = 9;
            return context.db.query('SELECT COUNT(id) FROM prelaunch.registration');

          case 9:
            countResponse = _context6.sent;

            callback(null, {
              influence: response.rows,
              count: countResponse.rows[0].count
            });

          case 11:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("middy");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("http-errors");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("middy/middlewares");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("pg");

/***/ })
/******/ ])));
//# sourceMappingURL=jfs.js.map