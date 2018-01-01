import Vue from 'vue'
import Vuex from 'vuex'
import { Base64 } from 'js-base64'
import createLogger from 'vuex/dist/logger'
import UsersApi from '../api/users'

Vue.use(Vuex)

const state = {
  currentUser: {
    id: undefined,
    avatar: '',
    firstName: '',
    lastName: '',
    email: '',
    zip: ''
  }
}

const mutations = {
  updateUser(state, user) {
    state.currentUser = user
  }
}

const actions = {
  async register({ commit, state }) {
    // const response = await UsersApi.register(state.currentUser)
    // commit('updateUser', response)
  },
  async facebookConnect({ commit, state }, {search}) {
    const response = await UsersApi.facebookConnect(search)
    console.log('response', response)
    const raw = Base64.decode(response.data.jwt.split('.')[1])
    const user = JSON.parse(raw)
    commit('updateUser', user)
  }
}

const getters = {
  firstName: state => state.currentUser.name
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [createLogger()]
})
