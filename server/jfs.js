'use strict'

var https = require('https')
var pg = require('knex')({
  client: 'pg',
  connection: process.env.dbUrl
})

module.exports.register = (event, context, callback) => {
  const body = JSON.parse(event.body)
  pg('prelaunch.registration')
    .where({ id: body.id })
    .update({
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      avatar_url: body.facebook_avatar,
      postal_code: body.zip
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
}
