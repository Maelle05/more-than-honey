import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    name: 'home',
    label: 'Home',
    component: Home
  },
  {
    path: '/hive',
    name: 'hive',
    label: 'Hive',
    component: function () {
      return import('../views/Hive.vue')
    },
    meta: {
      homePassedRequired: true,
    },
  },
  {
    path: '/outsideOne',
    name: 'outsideOne',
    label: 'Outside one',
    component: function () {
      return import('../views/OutsideOne.vue')
    },
    meta: {
      homePassedRequired: true,
    },
  },
  {
    path: '/pollenGame',
    name: 'pollenGame',
    label: 'Pollen game',
    component: function () {
      return import('../views/PollenGame.vue')
    },
    meta: {
      homePassedRequired: true,
    },
  },
  {
    path: '/outsideTwo',
    name: 'outsideTwo',
    label: 'Outside two',
    component: function () {
      return import('../views/OutsideTwo.vue')
    },
    meta: {
      homePassedRequired: true,
    },
  },
  {
    path: '/raceGame',
    name: 'raceGame',
    label: 'Race game',
    component: function () {
      return import('../views/RaceGame.vue')
    },
    meta: {
      homePassedRequired: true,
    },
  },
  {
    path: '/ending',
    name: 'ending',
    label: 'End',
    component: function () {
      return import('../views/Ending.vue')
    },
    meta: {
      homePassedRequired: true,
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: "active" // active class for *exact* links.
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.homePassedRequired)) {
    if (localStorage.getItem('isHomePassed') === 'true') {
      next()
    } else {
      // next({
      //   path: '/',
      // })
      next()
      localStorage.setItem('isHomePassed', true)
    }
  } else {
    next()
  }
})

export default router
