// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import App from './App'
import router from './router'
import store from './store'
import './assets/styles.css'

console.log(process.env)
Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: true,
  connection: process.env.API
}))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
