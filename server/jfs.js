'use strict'

var https = require('https')

console.log('DB creds:', process.env.dbUrl)
var pg = require('knex')({
  client: 'pg',
  connection: process.env.dbUrl
})

module.exports.root = (event, context, callback) => {
  callback(null, { statusCode: 200, body: { message: 'ok' } })
}

module.exports.register = (event, context, callback) => {
  const body = JSON.parse(event.body)
  pg('prelaunch.registration')
    .select('id')
    .where({ email: body.friend })
    .orWhere(pg.raw('id::varchar = ?', [body.friend]))
    .first()
    .then(row => {
      pg('prelaunch.registration')
        .where({ id: body.id })
        .update({
          first_name: body.firstName,
          last_name: body.lastName,
          email: body.email,
          avatar_url: body.facebook_avatar,
          postal_code: body.zip,
          sponsor_id: row.id
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

module.exports.get = (event, context, callback) => {
  const id = event.pathParameters.id

  pg('prelaunch.registration')
    .select()
    .where({ id: id })
    .first()
    .then(function(row) {
      var response = {
        statusCode: 200,
        body: Object.assign({}, row)
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
