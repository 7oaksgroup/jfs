'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"uat"',
  API_URL: '"https://n6iouwia53.execute-api.us-west-2.amazonaws.com/production/"'
})
