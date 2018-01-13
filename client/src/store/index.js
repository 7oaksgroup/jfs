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
  },
  friends: []
}

const mutations = {
  updateUser(state, user) {
    state.currentUser = { ...state.currentUser, ...user }
  },
  addFriends(state, friends) {
    if (Array.isArray(friends)) {
      state.friends = friends
    } else {
      state.friends = [friends]
    }
  }
}

const actions = {
  async register({ commit, state }) {
    const response = await UsersApi.register(state.currentUser)
    commit('updateUser', response)
  },
  async facebookConnect({ commit, state }, { search }) {
    const response = await UsersApi.facebookConnect(search)
    localStorage.setItem('jwt', response.data.jwt)
    const raw = Base64.decode(response.data.jwt.split('.')[1])
    const user = JSON.parse(raw)
    commit('updateUser', user)
  },
  async loadUser({ commit }) {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      const raw = Base64.decode(jwt.split('.')[1])
      const parsed = JSON.parse(raw)
      const user = await UsersApi.get(parsed.id)
      commit('updateUser', user.data)
    }
  },
  saveFriend({ commit }, friend) {
    localStorage.setItem('friend', friend)
    commit('updateUser', { friend })
  },
  async search({ commit }, searchName) {
    const response = await UsersApi.search(searchName)
    commit('addFriends', response.data)
  }
}

const getters = {
  firstName: state => state.currentUser.name,
  isLoggedIn: state => {
    return state.currentUser.id && state.currentUser.facebook_id
  },
  getFriend: state => state.currentUser.friend || localStorage.getItem('friend')
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [createLogger()]
})
