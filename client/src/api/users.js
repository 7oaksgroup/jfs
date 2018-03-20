import axios from 'axios'

import { TENANT_ID } from '../config/TenantConfig'

const tenantId = TENANT_ID
const api = axios.create({
  baseURL: process.env.API_URL
})

const jwt = localStorage.getItem('jwt')
api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

export default {
  register: user => {
    return api.post(`/prelaunch/tenant/${tenantId}/register`, user)
  },
  facebookConnect: search => {
    return api.get(`/prelaunch/tenant/${tenantId}/auth/facebook?${search}`)
  },
  search: search => {
    return api.get(`/prelaunch/tenant/${tenantId}/search?name=${search}`)
  },
  get: id => {
    return api.get(`/prelaunch/tenant/${tenantId}/user/${id}`)
  },
  getFacebookFriends: ids => {
    return api.get(`/prelaunch/tenant/${tenantId}/friends?ids=${ids.join(',')}`)
  },
  getInfluence: () => {
    return api.get(`/prelaunch/tenant/${tenantId}/influence`)
  },
  getLeaderboard: () => {
    return api.get(`/prelaunch/tenant/${tenantId}/leaderboard`)
  },
  getReports: () => {
    return api.get(`/prelaunch/tenant/${tenantId}/reports`)
  },
  updateJwt: () => {
    const jwt = localStorage.getItem('jwt')
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
  }
}
