
export const TENANT_ID = process.env.TENANT_ID

// TODO assert this better
if (!TENANT_ID) {
  throw new Error('Could not determine Tenant ID from environment in TenantConfig.js - Please contact support')
}
