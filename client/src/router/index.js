import Vue from 'vue'
import Router from 'vue-router'
import VueAnalytics from 'vue-analytics'
import Home from '@/containers/Home'
import Register from '@/containers/Register'
import Facebook from '@/containers/Facebook'
import Office from '@/containers/Office'
import Friend from '@/containers/Friend'
import NotFound from '@/containers/NotFound'

import { TENANT_ID } from '../config/TenantConfig'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/office',
      name: 'Office',
      component: Office
    },
    {
      path: '/invite',
      redirect: '/'
    },
    {
      path: '/findfriend',
      name: 'Find A Friend',
      component: Friend
    },
    {
      path: '/auth/facebook',
      name: 'FacebookConnect',
      component: Facebook
    },
    {
      path: '/login/facebook',
      redirect: () => {
        const redirect = encodeURIComponent(`${window.location.origin}/auth/facebook`)
        window.location.href = `${process.env.API_URL}/prelaunch/tenant/${TENANT_ID}/auth/facebook?redirectUrl=${redirect}`
      }
    },
    { path: '*', component: NotFound }
  ]
})

Vue.use(VueAnalytics, {
  id: process.env.GA,
  router
})

export default router
