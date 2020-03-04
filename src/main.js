// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import App from './App'
import router from './router'
import store from './store'
import './assets/styles.css'

Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://127.0.0.1:4040'
  // connection: 'https://imapi.wozaizhao.com'
}))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
