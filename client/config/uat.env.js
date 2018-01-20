'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"uat"',
  API_URL: '"https://z6sb0s49la.execute-api.us-west-2.amazonaws.com/uat/"'
})
