import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import networkParser from './NetworkParser'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

require('electron').ipcRenderer.on('NewNetworkMessage', (event, message) => {
  networkParser.parse(store, message)
})

export default store
