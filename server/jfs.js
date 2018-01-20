'use strict'

const { prettyErrorHandler } = require('./middleware')
const SQL = require('yesql').pg

const middy = require('middy')
const createErr = require('http-errors')
const {
  urlEncodeBodyParser,
  httpErrorHandler,
  cors
} = require('middy/middlewares')
var jwt = require('jsonwebtoken')

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.dbUrl
})

const databaseMiddleware = config => ({
  before: async (handler, next) => {
    handler.context.db = await pool.connect()
    next()
  },
  after: (handler, next) => {
    handler.context.db.release(true)
    next()
  }
})

// Should be added last in the chain (so closest on the onion)
const detectingResponseType = (config = {}) => ({
  after: (handler, next) => {
    // handler.response has our value
    let value = handler.response

    if (value === null) {
      value = {
        statusCode: 404,
        body: {
          message: 'Not found'
        }
      }
    } else {
      value = {
        statusCode: config.statusCode || 200,
        body: JSON.stringify(value)
      }
    }

    handler.response = value
    next()
  }
})
const curry = fn => {
  return middy(fn)
    .use(cors())
    .use(prettyErrorHandler())
    .use(urlEncodeBodyParser())
    .use(databaseMiddleware())
    .use(detectingResponseType())
}

module.exports.root = curry((event, context, callback) => {
  callback(null, { message: 'ok' })
})

module.exports.register = curry(async (event, context, callback) => {
  const {
    inviteCode,
    firstName,
    lastName,
    email,
    facebook_avatar,
    zip
  } = JSON.parse(event.body)

  const friendQuery = {
    text: 'SELECT * FROM prelaunch.registration where email = $1 OR id::varchar = $1',
    values: [inviteCode]
  }
  const friendResponse = await context.db.query(friendQuery)
  console.log(friendQuery, friendResponse)
  if (!friendResponse.rows[0]) {
    callback(createErr(400, 'Invite Code was not valid.'))
  }
  const friendId = friendResponse.rows[0].id

  const registerQuery = {
    text: `UPDATE
      prelaunch.registration
      SET first_name = $1, last_name = $2, email = $3, avatar_url = $4, postal_code = $5, sponsor_id = $6 
      WHERE facebook_email = $3`,
    values: [firstName, lastName, email, facebook_avatar, zip, friendId]
  }
  await context.db.query(registerQuery)

  const getQuery = {
    text: 'SELECT * FROM prelaunch.registration where email = $1',
    values: [email]
  }
  const getResponse = await context.db.query(getQuery)

  callback(null, getResponse.rows[0])
})

module.exports.search = curry(async (event, context, callback) => {
  const name = event.queryStringParameters.name
  const query = `%${name}%`
  const searchResponse = await context.db.query(
    SQL(
      `
    SELECT * FROM prelaunch.registration 
    WHERE lower(first_name) like :query OR lower(last_name) like :query
  `
    )({
      query
    })
  )
  callback(null, searchResponse.rows[0])
})

module.exports.getUser = curry(async (event, context, callback) => {
  const id = event.pathParameters.id
  const userQuery = {
    text: 'SELECT * FROM prelaunch.registration where id = $1',
    values: [id]
  }
  const userResponse = await context.db.query(userQuery)
  callback(null, userResponse.rows[0])
})

module.exports.facebookFriends = curry(async (event, context, callback) => {
  const ids = event.queryStringParameters.ids
  const facebookIds = ids.split(',')
  const friendQuery = {
    text: 'SELECT * FROM prelaunch.registration WHERE facebook_id IN ($1)',
    values: [facebookIds]
  }
  const friendResponse = await context.db.query(friendQuery)
  callback(null, friendResponse.rows)
})

module.exports.influence = curry(async (event, context, callback) => {
  const { Authorization } = event.headers
  const token = Authorization.split(' ')[1]
  const decoded = jwt.verify(token, process.env.jwtKey)
  const influenceQuery = {
    text: `select d.*
      from prelaunch.genealogy d
      inner join prelaunch.genealogy target on target.id = $1
      where d.path[target.depth] = target.id
        and d.id != target.id`,
    values: [decoded.id]
  }
  const response = await context.db.query(influenceQuery)
  const countResponse = await context.db.query(
    `SELECT COUNT(id) FROM prelaunch.registration`
  )
  callback(null, {
    influence: response.rows,
    count: countResponse.rows[0].count
  })
})
