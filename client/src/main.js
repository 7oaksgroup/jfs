import './middleware/bugsnag'
import Vue from 'vue'
import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
import 'chart.js'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueChartkick, { Chartkick })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render(h) {
    return h(App)
  }
})
