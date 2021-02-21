import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'

import './plugins/vant'

import axios from 'axios'

Vue.use(VueLazyload, {
  preLoad: 1,
  loading: require('@/components/recommend/slide.png'),
  error: require('@/components/recommend/slide.png')
})
Vue.config.productionTip = false

axios.defaults.baseURL = 'http://192.168.0.117:3000/'
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
