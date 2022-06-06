import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    numberOfLife: 5
  },
  mutations: {
    looseLife (state) {
      state.numberOfLife --
    }
  },
  actions: {
    looseLife: ({ commit }) => commit('looseLife')
  },
  modules: {
  }
})
