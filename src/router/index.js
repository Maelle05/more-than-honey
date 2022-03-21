import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/fox',
    name: 'fox',
    component: function () {
      return import('../views/Fox.vue')
    }
  },
  {
    path: '/bee',
    name: 'bee',
    component: function () {
      return import('../views/Bee.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
