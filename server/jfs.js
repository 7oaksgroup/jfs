'use strict'

var https = require('https')
var pg = require('knex')({
  client: 'pg',
  connection: process.env.dbUrl
})

module.exports.register = (event, context, callback) => {
  const body = JSON.parse(event.body)

  pg('prelaunch.registration')
    .select('id')
    .where({ email: body.friend })
    .first()
    .then(id => {
      pg('prelaunch.registration')
        .where({ id: body.id })
        .update({
          first_name: body.firstName,
          last_name: body.lastName,
          email: body.email,
          avatar_url: body.facebook_avatar,
          postal_code: body.zip,
          sponsor_id: id
        })
        .returning('*')
        .then(function(rows) {
          var response = {
            statusCode: 200,
            body: Object.assign({}, rows[0])
          }
          callback(null, response)
        })
        .catch(function(err) {
          var response = {
            statusCode: 500,
            body: { err }
          }
          callback(null, response)
        })
    })
}

module.exports.search = (event, context, callback) => {
  const name = event.queryStringParameters.name

  pg('prelaunch.registration')
    .select()
    .where('first_name', 'like', '%' + name + '%')
    .orWhere('last_name', 'like', '%' + name + '%')
    .then(function(rows) {
      var response = {
        statusCode: 200,
        body: Object.assign({}, rows[0])
      }
      callback(null, response)
    })
    .catch(function(err) {
      var response = {
        statusCode: 500,
        body: { err }
      }
      callback(null, response)
    })
}
