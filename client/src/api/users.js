import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL
})

const jwt = localStorage.getItem('jwt')
api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

export default {
  register: user => {
    return api.post('/prelaunch/register', user)
  },
  facebookConnect: search => {
    return api.get(`/prelaunch/auth/facebook?${search}`)
  },
  search: search => {
    return api.get(`/prelaunch/search?name=${search}`)
  },
  get: id => {
    return api.get(`/prelaunch/user/${id}`)
  },
  getFacebookFriends: ids => {
    return api.get(`/prelaunch/friends?ids=${ids.join(',')}`)
  },
  getInfluence: () => {
    return api.get('/prelaunch/influence')
  },
  updateJwt: () => {
    const jwt = localStorage.getItem('jwt')
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
  }
}
