'use strict'

var https = require('https')
var pg = require('knex')({
  client: 'pg',
  connection: process.env.dbUrl
})

const cors = module.exports.cors = {
  "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
}

module.exports.root = (event, context, callback) => {
  callback(null, { statusCode: 200, headers: cors, body: JSON.stringify({ message: 'ok' }) })
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
            headers: cors,
            body: Object.assign({}, rows[0])
          }
          callback(null, response)
        })
        .catch(function(err) {
          var response = {
            statusCode: 500,
            headers: cors,
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
        headers: cors,
        body: Object.assign({}, rows[0])
      }
      callback(null, response)
    })
    .catch(function(err) {
      var response = {
        statusCode: 500,
        headers: cors,
        body: { err }
      }
      callback(null, response)
    })
}

module.exports.get = (event, context, callback) => {
  const id = event.pathParameters.id

  console.log('get.pre')
  pg('prelaunch.registration')
    .select()
    .where({ id: id })
    .first()
    .then(function(row) {
      console.log('get.success')
      var response = {
        statusCode: 200,
        headers: cors,
        body: Object.assign({}, row)
      }
      callback(null, JSON.stringify(response) )
    })
    .catch(function(err) {
      console.log('get.fail', err)
      var response = {
        statusCode: 500,
        headers: cors,
        body: { err }
      }
      callback(null, JSON.stringify(response) )
    })
}
