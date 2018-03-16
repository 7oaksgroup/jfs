'use strict'
module.exports = {
  NODE_ENV: '"production"',
  API_URL: '"https://f7nf4yzef7.execute-api.us-west-2.amazonaws.com/production/"',
  GA: '"UA-112834045-1"',
  DEFAULT_CODE: 2,
  BUGSNAG: '"aba1824db36eb0ed2d855667e97b0ff7"',
  TENANT_ID: process.env.TENANT_ID
}

if (!module.exports.TENANT_ID) {
  throw new Error('Could not determine Tenant ID from environment in TenantConfig.js - Please contact support')
}
