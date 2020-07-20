import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import axios from 'axios';
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
