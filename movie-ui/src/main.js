import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import axios from 'axios';
import 'buefy/dist/buefy.css'
import VueRouter from 'vue-router'
import LogIn from '@/components/LogIn'

Vue.use(VueRouter)
Vue.use(Buefy)

Vue.prototype.$http = axios


Vue.config.productionTip = false

const routes = [
  { path: '/home', component: LogIn },
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
