import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    numberOfLife: 3,
    isSongOn: true,
  },
  mutations: {
    looseLife (state) {
      state.numberOfLife --
    },
    songOn (state) {
      state.isSongOn = true
    },
    songOff (state) {
      state.isSongOn = false
    },
  },
  actions: {
    looseLife: ({ commit }) => commit('looseLife'),
    songOn: ({ commit }) => commit('songOn'),
    songOff: ({ commit }) => commit('songOff'),
  },
  modules: {
  }
})
