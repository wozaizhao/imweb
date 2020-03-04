import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login'
import Chat from '@/pages/chat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    }
  ]
})
