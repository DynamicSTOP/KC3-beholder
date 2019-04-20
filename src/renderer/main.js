import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import {remote} from 'electron'

remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

let devPage = false
remote.globalShortcut.register('CommandOrControl+Shift+I', () => {
  devPage = !devPage
  if (devPage) {
    router.push({name: 'dev-icons'})
  } else {
    router.push({name: 'kc3-panel'})
  }
})

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
