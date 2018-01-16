import Vue from 'vue'
import Vuex from 'vuex'
import { Base64 } from 'js-base64'
import createLogger from 'vuex/dist/logger'
import UsersApi from '../api/users'

Vue.use(Vuex)

const state = {
  currentUser: {},
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
    if (
      response.data.extra.friends &&
      response.data.extra.friends.data.length > 0
    ) {
      localStorage.setItem(
        'facebookFriends',
        JSON.stringify(response.data.extra.friends.data)
      )
    }
  },
  async loadUser({ commit }) {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      const raw = Base64.decode(jwt.split('.')[1])
      const parsed = JSON.parse(raw)
      commit('updateUser', parsed)
      const user = await UsersApi.get(parsed.id)
      commit('updateUser', user.data)
    }
  },
  saveFriend({ commit }, friend) {
    localStorage.setItem('friend', friend)
    commit('updateUser', { friend })
  },
  clearStorage() {
    localStorage.removeItem('facebookFriends')
    localStorage.removeItem('friend')
  },
  async showFacebookFriends({ commit }) {
    const facebookFriends = JSON.parse(localStorage.getItem('facebookFriends'))
    const friendIds = facebookFriends.map(ff => ff.id)
    const response = await UsersApi.getFacebookFriends(friendIds)
    commit('addFriends', response.data)
  },
  async search({ commit }, searchName) {
    const response = await UsersApi.search(searchName)
    commit('addFriends', response.data)
  }
}

const getters = {
  firstName: state =>
    state.currentUser.firstName || state.currentUser.first_name,
  isLoggedIn: state => {
    if (state.currentUser.id && state.currentUser.facebook_id) {
      return true
    }
    return false
  },
  isRegistered: state => {
    if (
      state.currentUser.id &&
      state.currentUser.facebook_id &&
      state.currentUser.postal_code
    ) {
      return true
    }
    return false
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
