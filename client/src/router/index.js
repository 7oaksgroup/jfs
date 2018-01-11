import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/containers/Home'
import Register from '@/containers/Register'
import Facebook from '@/containers/Facebook'
import Office from '@/containers/Office'
import Friend from '@/containers/Friend'

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
        window.location.href = '/prelaunch/auth/facebook'
      }
    }
  ]
})
