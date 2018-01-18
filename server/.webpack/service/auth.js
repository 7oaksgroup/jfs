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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
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
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__(0);

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = __webpack_require__(11);

var _assign2 = _interopRequireDefault(_assign);

__webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OAuth2 = __webpack_require__(12).OAuth2;
var https = __webpack_require__(13);
var jwt = __webpack_require__(2);

var oauth2 = new OAuth2(process.env.appKey, process.env.appSecret, 'https://graph.facebook.com/', null, 'v2.8/oauth/access_token');

var options = {
  redirect_uri: process.env.redirectUrl
};

module.exports.facebook = function (event, context, callback) {
  /*
  * return error if query string has an error parameter. e.g. if user
  * declines to grant access.
  * error=access_denied&error_code=200&error_description=Permissions+error&error_reason=user_denied
  */
  if (event.queryStringParameters && event.queryStringParameters.error) {
    console.log(event.queryStringParameters);
    callback(null, getFailureResponse(event.queryStringParameters));
  } else if (!event.queryStringParameters || !event.queryStringParameters.code) {
    // redirect to facebook if "code" is not provided in the query string
    callback(null, {
      statusCode: 302,
      headers: {
        Location: 'https://www.facebook.com/v2.11/dialog/oauth' + '?client_id=' + process.env.appKey + '&redirect_uri=' + process.env.redirectUrl + '&scope=email,user_friends'
      }
    });
  } else {
    // process request from facebook that has "code"
    oauth2.getOAuthAccessToken(event.queryStringParameters.code, options, function (error, access_token, refresh_token, results) {
      if (error) {
        console.log(error);
        callback(null, getFailureResponse(error));
      }

      var url = 'https://graph.facebook.com/me?fields=id,name,email,picture,friends&access_token=' + access_token;

      https.get(url, function (res) {
        console.log('got response: ' + res.statusCode);

        var body = '';

        res.on('data', function (chunk) {
          body += chunk;
        });

        res.on('end', function () {
          var json = JSON.parse(body);
          console.log('FACEBOOK RESPONSE', json);
          var user = {
            facebookId: json.id,
            name: json.name,
            email: json.email,
            avatar: json.picture.data.url
          };

          var pg = __webpack_require__(14)({
            client: 'pg',
            connection: process.env.dbUrl
          });

          pg('prelaunch.registration').select('*').where({ facebook_id: user.facebookId }).then(function (rows) {
            if (rows.length > 0) {
              return rows;
            } else {
              return pg('prelaunch.registration').insert({
                facebook_id: user.facebookId,
                facebook_name: user.name,
                facebook_email: user.email,
                facebook_avatar: user.avatar,
                email: user.email
              }).returning('*');
            }
          }).then(function (rows) {
            callback(null, getSuccessResponse((0, _assign2.default)({}, rows[0]), json));
            pg.destroy();
          });
        });
      }).on('error', function (error) {
        console.log(error);
        callback(null, getFailureResponse(error));
        pg.destroy();
      });
    });
  }
};

function getSuccessResponse(user, extra) {
  var token = jwt.sign(user, process.env.jwtKey);
  var response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS support to work
    },
    body: (0, _stringify2.default)({ jwt: token, extra: extra })
  };
  return response;
}

function getFailureResponse(error) {
  // this pretty raw... were just going to return a crude error... you could
  // do something pretty here
  var response = {
    statusCode: 400,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS support to work
    },
    body: (0, _stringify2.default)(error)
  };
  return response;
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/assign");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("oauth");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("knex");

/***/ })
/******/ ])));
//# sourceMappingURL=auth.js.map