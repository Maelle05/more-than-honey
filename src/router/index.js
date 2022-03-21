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
  },
  {
    path: '/planetBreath',
    name: 'planetBreath',
    component: function () {
      return import('../views/PlanetBreathHome.vue')
    }
  },
  {
    path: '/planetBreath/intro',
    name: 'planetBreathIntro',
    component: function () {
      return import('../views/PlanetBreathIntro.vue')
    }
  },
  {
    path: '/loading',
    name: 'loading',
    component: function () {
      return import('../views/Loading.vue')
    }
  },
  {
    path: '/hive',
    name: 'hive',
    component: function () {
      return import('../views/Hive.vue')
    }
  },
  {
    path: '/outside/one',
    name: 'outsideOne',
    component: function () {
      return import('../views/OutsideOne.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
