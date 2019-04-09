import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(process.env.NODE_ENV === 'production' ? '/background.js' : '/src/background/kccdp.js')
    .then(function (reg) {
      // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope)
    }).catch(function (error) {
      // registration failed
      console.log('Registration failed with ' + error)
    })
}
