const state = {
  uiCensor: false,
  uiCurrentPanel: 'fleet',
  uiCurrentFleet: 0
}

if (localStorage.uiState) {
  try {
    Object.assign(state, JSON.parse(localStorage.uiState))
  } catch (e) {
    console.error(e)
  }
}

function saveToLocalStorage () {
  localStorage.uiState = JSON.stringify(state)
}

const mutations = {
  UI_TOGGLE_CENSOR (state) {
    state.uiCensor = !state.uiCensor
    saveToLocalStorage()
  },
  UI_SWITCH_PANEL (state, tabName) {
    state.uiCurrentPanel = tabName
    saveToLocalStorage()
  }
}

const actions = {
  UI_TOGGLE_CENSOR (context) {
    context.commit('UI_TOGGLE_CENSOR')
  },
  UI_SWITCH_PANEL (context, tabName) {
    context.commit('UI_SWITCH_PANEL', tabName)
  }
}

const getters = {
  uiCensor: state => state.uiCensor,
  uiCurrentPanel: state => state.uiCurrentPanel,
  uiCurrentFleet: state => state.uiCurrentFleet
}

export default {
  state,
  mutations,
  actions,
  getters
}
