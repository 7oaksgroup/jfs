'use strict'

module.exports = {
  NODE_ENV: '"uat"',
  API_URL: '"https://z6sb0s49la.execute-api.us-west-2.amazonaws.com/uat/"',
  GA: '"UA-112865665-1"',
  DEFAULT_CODE: 5,
  TENANT_ID: process.env.TENANT_ID
}

if (!module.exports.TENANT_ID) {
  throw new Error('Could not determine Tenant ID from environment in TenantConfig.js - Please contact support')
}
