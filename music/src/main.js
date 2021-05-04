import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import vfilters from './components/common/filters'
import './assets/icon/iconfont.css'

import './plugins/vant'

import axios from 'axios'

for (const key in vfilters) {
  Vue.filter(key, vfilters[key])
}

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('@/components/recommend/slide.png')
  // error: require('@/components/recommend/slide.png')
})
Vue.config.productionTip = false

// axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.baseURL = 'http://192.168.2.242:3000/'
// axios.defaults.baseURL = 'http://192.168.221.143:3000/'
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
