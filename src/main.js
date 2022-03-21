import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/**
* Vue
*/

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')


/**
* Webgl
*/

import WebGl from './webgl/webglManager'
import Root from './webgl/utils/Root'

new WebGl()

const rootManager = new Root()

export function change(name){
  rootManager.rootChange(name)
}