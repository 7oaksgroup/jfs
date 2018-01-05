import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/containers/Home'
import Register from '@/containers/Register'

Vue.use(Router)

export default new Router({
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
      path: '/auth/facebook',
      name: 'FacebookConnect',
      component: Register
    },
    {
      path: '/login/facebook',
      redirect: () => { window.location.href = 'http://localhost:3000/auth/facebook' }
    }
  ]
})
