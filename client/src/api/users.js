import axios from 'axios'

export default {
  register: user => {
    return axios.post('/prelaunch/register', user)
  },
  facebookConnect: search => {
    return axios.get(`/prelaunch/auth/facebook?${search}`)
  },
  search: search => {
    return axios.get(`/prelaunch/search?name=${search}`)
  }
}
