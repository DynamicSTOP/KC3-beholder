const state = {
  ssHost: 'localhost',
  ssPort: 9222,
  ssAuto: false
}

if (localStorage.ssState) {
  try {
    Object.assign(state, JSON.parse(localStorage.ssState))
  } catch (e) {
    console.debug(e.toString())
  }
}

function saveToLocalStorage () {
  localStorage.ssState = JSON.stringify(state)
}

const mutations = {
  UPDATE_SS_VALUE (state, data) {
    let {key, value} = data
    state['ss' + key] = value
    saveToLocalStorage()
  }
}

const actions = {
  UPDATE_SS_VALUE (context, data) {
    context.commit('UPDATE_SS_VALUE', data)
  }
}

const getters = {
  startScreenHost: state => state.ssHost,
  startScreenPort: state => state.ssPort,
  startScreenAuto: state => state.ssAuto
}

export default {
  state,
  mutations,
  actions,
  getters
}
