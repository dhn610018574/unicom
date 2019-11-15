import Vue from 'vue'
import Storage from 'vue-ls'
import App from './App.vue'
import router from './router'
import store from './store'

import config from '@/defaultSettings'
import { VueAxios } from '@/utils/request'
import '@/permission' // permission control
import '@/plugins/antd'
import api from '@/api'
Vue.prototype.$api = api

Vue.config.productionTip = false
Vue.use(Storage, config.storageOptions)
Vue.use(VueAxios, router)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
