'use strict'

var OAuth2 = require('oauth').OAuth2
var https = require('https')
var jwt = require('jsonwebtoken')
var pg = require('knex')({
  client: 'pg',
  connection: process.env.dbUrl
})

var oauth2 = new OAuth2(
  process.env.appKey,
  process.env.appSecret,
  'https://graph.facebook.com/',
  null,
  'v2.8/oauth/access_token'
)

var options = {
  redirect_uri: process.env.redirectUrl
}

module.exports.facebook = (event, context, callback) => {
  /*
  * return error if query string has an error parameter. e.g. if user
  * declines to grant access.
  * error=access_denied&error_code=200&error_description=Permissions+error&error_reason=user_denied
  */
  if (event.queryStringParameters && event.queryStringParameters.error) {
    console.log(event.queryStringParameters)
    callback(null, getFailureResponse(event.queryStringParameters))
  } else if (
    !event.queryStringParameters || !event.queryStringParameters.code
  ) {
    // redirect to facebook if "code" is not provided in the query string
    callback(null, {
      statusCode: 302,
      headers: {
        Location: 'https://www.facebook.com/v2.5/dialog/oauth' +
          '?client_id=' +
          process.env.appKey +
          '&redirect_uri=' +
          process.env.redirectUrl +
          '&scope=email'
      }
    })
  } else {
    // process request from facebook that has "code"
    oauth2.getOAuthAccessToken(
      event.queryStringParameters.code,
      options,
      function(error, access_token, refresh_token, results) {
        if (error) {
          console.log(error)
          callback(null, getFailureResponse(error))
        }

        var url =
          'https://graph.facebook.com/me?fields=id,name,email,picture&access_token=' +
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
              var user = {
                facebookId: json.id,
                name: json.name,
                email: json.email,
                avatar: json.picture.data.url
              }
              console.log('++ USER ', user)

              // you could save/update user details in a DB here...
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
                        facebook_avatar: user.avatar
                      })
                      .returning('*')
                  }
                })
                .then(function(rows) {
                  callback(
                    null,
                    getSuccessResponse(
                      Object.assign({}, rows[0]),
                      process.env.appUrl
                    )
                  )
                })
            })
          })
          .on('error', function(error) {
            console.log(error)
            callback(null, getFailureResponse(error))
          })
      }
    )
  }
}

function getSuccessResponse(user) {
  var token = jwt.sign(user, 'SUPER SECRET KEY')
  var response = {
    statusCode: 200,
    headers: {
      'X-JWT-TOKEN': token
    },
    body: {
      jwt: token
    }
  }
  return response
}

function getFailureResponse(error) {
  // this pretty raw... were just going to return a crude error... you could
  // do something pretty here
  var response = {
    statusCode: 400,
    body: JSON.stringify(error)
  }
  return response
}
