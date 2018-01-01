import Vue from 'vue'
import Vuex from 'vuex'
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
    const response = await UsersApi.register(state.currentUser)
    commit('updateUser', response)
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
