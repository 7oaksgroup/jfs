'use strict'

var OAuth2 = require('oauth').OAuth2
var https = require('https')
var jwt = require('jsonwebtoken')

var oauths = {
  1001: new OAuth2(
    process.env.appKey1001,
    process.env.appSecret1001,
    'https://graph.facebook.com/',
    null,
    'v2.8/oauth/access_token'
  ),
  1002: new OAuth2(
    process.env.appKey1002,
    process.env.appSecret1002,
    'https://graph.facebook.com/',
    null,
    'v2.8/oauth/access_token'
  )
}

var options = {
  redirect_uri: process.env.redirectUrl
}

module.exports.facebook = (event, context, callback) => {
  /*
  * return error if query string has an error parameter. e.g. if user
  * declines to grant access.
  * error=access_denied&error_code=200&error_description=Permissions+error&error_reason=user_denied
  */
  const tenantId = event.pathParameters.tenantId
  const qs = event.queryStringParameters || {}
  if (qs.error) {
    console.log(qs)
    callback(null, getFailureResponse(qs))
  } else if ( !qs.code){
    if( !qs.redirectUrl ){
      throw new Error('Cannot authenticate with Facebook without a redirect URL')
    }
    // redirect to facebook if "code" is not provided in the query string
    callback(null, {
      statusCode: 302,
      headers: {
        Location: 'https://www.facebook.com/v2.11/dialog/oauth' +
          '?client_id=' +
          process.env[`appKey${tenantId}`] +
          '&redirect_uri=' +
          qs.redirectUrl +
          '&scope=email,user_friends'
      }
    })
  } else if (qs.code) {
    // process request from facebook that has "code"
    var oauth2 = oauths[tenantId]
    oauth2.getOAuthAccessToken(
      qs.code,
      options,
      function(error, access_token, refresh_token, results) {
        if (error) {
          console.log(error)
          callback(null, getFailureResponse(error))
        }

        var url =
          'https://graph.facebook.com/me?fields=id,name,email,picture,friends&access_token=' +
          access_token

        https
          .get(url, function(res) {
            console.log('got response: ' + res.statusCode)

            var body = ''

            res.on('data', function(chunk) {
              body += chunk
            })

            res.on('end', function() {
              var json = JSON.parse(body)
              console.log('FACEBOOK RESPONSE', json)
              var user = {
                facebookId: json.id,
                name: json.name,
                email: json.email,
                avatar: json.picture.data.url
              }

              var pg = require('knex')({
                client: 'pg',
                connection: process.env.dbUrl
              })

              pg('prelaunch.registration')
                .select('*')
                .where({ facebook_id: user.facebookId })
                .then(function(rows) {
                  if (rows.length > 0) {
                    return rows
                  } else {
                    return pg('prelaunch.registration')
                      .insert({
                        facebook_id: user.facebookId,
                        facebook_name: user.name,
                        facebook_email: user.email,
                        facebook_avatar: user.avatar,
                        email: user.email
                      })
                      .returning('*')
                  }
                })
                .then(function(rows) {
                  callback(
                    null,
                    getSuccessResponse(Object.assign({}, rows[0]), json)
                  )
                  pg.destroy()
                })
            })
          })
          .on('error', function(error) {
            console.log(error)
            callback(null, getFailureResponse(error))
            pg.destroy()
          })
      }
    )
  }
}

function getSuccessResponse(user, extra) {
  var token = jwt.sign(user, process.env.jwtKey)
  var response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS support to work
    },
    body: JSON.stringify({ jwt: token, extra: extra })
  }
  return response
}

function getFailureResponse(error) {
  // this pretty raw... were just going to return a crude error... you could
  // do something pretty here
  var response = {
    statusCode: 400,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS support to work
    },
    body: JSON.stringify(error)
  }
  return response
}
