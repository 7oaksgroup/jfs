import axios from 'axios'

const api = axios.create({ 
  baseURL: process.env.API_URL
})
console.log('I found this', process.env)

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
  }
}
