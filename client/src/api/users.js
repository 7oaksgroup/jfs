import axios from 'axios'

export default {
  register: user => {
    return axios.post('/api/register', user)
  },
  facebookConnect: search => {
    return axios.get(`http://localhost:3000/auth/facebook?${search}`)
  }
}
