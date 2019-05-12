const state = {
  uiCensor: false,
  uiCurrentPanel: 'fleet',
  uiCurrentFleet: 0,
  uiCurrentQuestFilter: 'current'
}

if (localStorage.uiState) {
  try {
    Object.assign(state, JSON.parse(localStorage.uiState))
  } catch (e) {
    console.debug(e.toString())
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
  },
  UI_SWITCH_FLEET (state, fleetId) {
    state.uiCurrentFleet = fleetId
    saveToLocalStorage()
  },
  UI_SWITCH_CURRENT_QUEST_FILTER (state, filter) {
    state.uiCurrentQuestFilter = filter
    saveToLocalStorage()
  }
}

const actions = {
  UI_TOGGLE_CENSOR (context) {
    context.commit('UI_TOGGLE_CENSOR')
  },
  UI_SWITCH_PANEL (context, tabName) {
    context.commit('UI_SWITCH_PANEL', tabName)
  },
  UI_SWITCH_FLEET (context, fleetId) {
    context.commit('UI_SWITCH_FLEET', fleetId)
  },
  UI_SWITCH_CURRENT_QUEST_FILTER (context, filter) {
    context.commit('UI_SWITCH_CURRENT_QUEST_FILTER', filter)
  }
}

const getters = {
  uiCensor: state => state.uiCensor,
  uiCurrentPanel: state => state.uiCurrentPanel,
  uiCurrentFleet: state => state.uiCurrentFleet,
  uiCurrentQuestFilter: state => state.uiCurrentQuestFilter
}

export default {
  state,
  mutations,
  actions,
  getters
}
