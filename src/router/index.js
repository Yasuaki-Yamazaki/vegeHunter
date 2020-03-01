import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from '@/components/SignIn.vue'
import MapPoint from '@/components/MapPoint.vue'
import Quiz from '@/components/Quiz.vue'
import Start from '@/components/Start.vue'
import Opening from '@/components/Opening.vue'
import InGame from '@/components/InGame.vue'

import store from '@/store/index.js'

import { AmplifyEventBus } from 'aws-amplify-vue'
import * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'

Vue.use(VueRouter)
Vue.use(AmplifyPlugin, AmplifyModules)

let user

getUser().then((user) => {
  if (user) {
    router.push({path: '/'})
  }
})

function getUser() {
  return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
    if (data && data.signInUserSession) {
      store.commit('setUser', data)
      return data;
    }
  }).catch(() => {
    store.commit('setUser', null)
    return null
  })
}

AmplifyEventBus.$on('authState', async (state) => {
  if (state === 'signedOut'){
    user = null
    store.commit('setUser', null)
    router.push({path: '/signin'})
  } else if (state === 'signedIn') {
    user = await getUser();
    router.push({path: '/'})
  }
})

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requireAuth:true }
  },
  {
    path: '/signin',
    name: 'signin',
    component: SignIn
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/mappoint',
    name: 'mappoint',
    component: MapPoint,
    meta: { requireAuth:true }
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: Quiz,
    meta: { requireAuth:true }
  },
  {
    path: '/start',
    name: 'start',
    component: Start,
    meta: { requireAuth:true }
  },
  {
    path: '/opening',
    name: 'opening',
    component: Opening,
    meta: { requireAuth:true }
  },
  {
    path: '/in-game',
    name: 'in-game',
    component: InGame,
    meta: { requireAuth:true }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeResolve(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    user = await getUser()
    if (!user) {
      return next({
        path: '/signin'
      })
    }
    return next()
  }
  return next()
})

export default router
