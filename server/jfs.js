'use strict'

var request = require('request')
var https = require('https')
var pg = require('knex')({
  client: 'pg',
  connection: process.env.dbUrl
})

module.exports.google = (event, context, callback) => {
  var Client = require('pg').Client
  
  var pg2 = new Client({
    connectionString: process.env.dbUrl
  })
  console.log('client')
  pg2.connect().then( () => {
    console.log('connect')
    return pg2.query('SELECT 1 as foo')
  }).then( res => {
    console.log('success', res.rows[0])
    var data = JSON.stringify(res.rows[0])
    console.log('stringified', data)
    callback(null, {
      statusCode: 200,
      body: data
    })
    console.log('afterCallback')
    return pg2.end()
  }).then( () => {
    console.log('after end')
  })
}

module.exports.root = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({ message: 'ok' })
  })
  pg.destroy()
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
            headers: {},
            body: JSON.stringify(Object.assign({}, rows[0]))
          }
          callback(null, response)
          pg.destroy()
        })
        .catch(function(err) {
          var response = {
            statusCode: 500,
            headers: {},
            body: JSON.stringify({ err: err })
          }
          callback(null, response)
          pg.destroy()
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
        headers: {},
        body: JSON.stringify(Object.assign({}, rows[0]))
      }
      callback(null, response)
    })
    .catch(function(err) {
      var response = {
        statusCode: 500,
        headers: {},
        body: JSON.stringify({ err: err })
      }
      callback(null, response)
      pg.destroy()
    })
}

module.exports.getUser = (event, context, callback) => {
  const id = event.pathParameters.id

  console.log('get.pre')
  pg('prelaunch.registration')
    .select()
    .where({ id: id })
    .first()
    .then(function(row) {
      console.log('get.success')
      callback(null, {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(Object.assign({}, row))
      })
      pg.destroy()
    })
    .catch(function(err) {
      console.log('get.fail', err)
      var response = {
        statusCode: 500,
        headers: {},
        body: JSON.stringify({ err: err })
      }
      callback(null, response)
      pg.destroy()
    })
}
