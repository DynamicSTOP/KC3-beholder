/* eslint camelcase: ["error", {allow: ["^api_"]}] */
// ^ this is kc devs to blame, not me
// pFlag: short for Progress Flag,
// for uncompleted quests:
// pFlag = 2: 80% <= progress percentage < 100%
// pFlag = 1: 50% <= progress percentage < 80%
// pFlag = 0:        progress percentage < 50%
import CONSTANTS from '@/helpers/constants'
import libQuests from '@/generated/quests'

const state = {
  qLastCheck: null,
  qRawQuests: {}
}

if (localStorage.ssState) {
  try {
    Object.assign(state, JSON.parse(localStorage.questsState))
  } catch (e) {
    console.debug(e.toString())
  }
}

function saveToLocalStorage () {
  localStorage.questsState = JSON.stringify(state)
}

const mutations = {
  PARSE_QUESTS_LIST (state, data) {
    let {responseBody} = data
    let {api_data} = responseBody
    let {api_list} = api_data
    // i am not crazy, you are crazy
    // https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats
    api_list.map((rawQuest) => {
      state.qRawQuests = Object.assign({}, state.qRawQuests, {[rawQuest.api_no]: rawQuest})
    })
    state.qLastCheck = new Date().getTime()
    saveToLocalStorage()
  },
  QUEST_COMPLETE (state, data) {
    let {postData} = data
    if (!state.qRawQuests[postData.api_quest_id]) {
      // FIXME probably should signal that viewer has untracked quests
      state.qRawQuests = Object.assign({}, state.qRawQuests, {[postData.api_quest_id]: {api_no: postData.api_quest_id}})
    }
    state.qRawQuests[postData.api_quest_id].api_state = CONSTANTS.QUEST_STATUS_COMPLETE
    saveToLocalStorage()
  },
  QUEST_UNSELECTED (state, data) {
    let {postData} = data
    if (!state.qRawQuests[postData.api_quest_id]) {
      // FIXME probably should signal that viewer has untracked quests
      state.qRawQuests = Object.assign({}, state.qRawQuests, {[postData.api_quest_id]: {api_no: postData.api_quest_id}})
    }
    state.qRawQuests[postData.api_quest_id].api_state = CONSTANTS.QUEST_STATUS_AVAILABLE
    saveToLocalStorage()
  }
}

const actions = {
  PARSE_QUESTS_LIST (context, data) {
    context.commit('PARSE_QUESTS_LIST', data)
  },
  QUEST_COMPLETE (context, data) {
    context.commit('QUEST_COMPLETE', data)
  },
  QUEST_UNSELECTED (context, data) {
    context.commit('QUEST_UNSELECTED', data)
  }
}

const getters = {
  questsLastCheck: state => state.qLastCheck,
  questsArray: state => Object.keys(state.qRawQuests).filter((questId) => questId.match(/\d+/)).map(k => state.qRawQuests[k]),
  // FIXME probably should still show not finished quests e.g. if it's complete but not clear it should be displayed.
  questsActive: state => getters.questsArray(state).filter(q => q.api_state === CONSTANTS.QUEST_STATUS_ACTIVE),
  questsAll: state => getters.questsNotComplete(state).filter(q => q.api_state !== CONSTANTS.QUEST_STATUS_COMPLETE),
  questsDaily: state => getters.questsNotComplete(state).filter(q => !!libQuests[q.api_no] && [CONSTANTS.QUEST_REPEAT_DAILY, CONSTANTS.QUEST_REPEAT_28, CONSTANTS.QUEST_REPEAT_370].indexOf(libQuests[q.api_no].repeat) !== -1),
  questsWeekly: state => getters.questsNotComplete(state).filter(q => !!libQuests[q.api_no] && libQuests[q.api_no].repeat === CONSTANTS.QUEST_REPEAT_WEEKLY),
  questsMonthly: state => getters.questsNotComplete(state).filter(q => !!libQuests[q.api_no] && libQuests[q.api_no].repeat === CONSTANTS.QUEST_REPEAT_MONTHLY),
  questsQuarterly: state => getters.questsNotComplete(state).filter(q => !!libQuests[q.api_no] && libQuests[q.api_no].repeat === CONSTANTS.QUEST_REPEAT_QUARTERLY),
  questsOnce: state => getters.questsNotComplete(state).filter(q => !!libQuests[q.api_no] && libQuests[q.api_no].repeat === CONSTANTS.QUEST_REPEAT_ONCE),
  questsAvailable: state => getters.questsArray(state).filter(q => q.api_state === CONSTANTS.QUEST_STATUS_AVAILABLE),
  questsComplete: state => getters.questsArray(state).filter(q => q.api_state === CONSTANTS.QUEST_STATUS_COMPLETE),
  questsNotComplete: state => getters.questsArray(state).filter(q => q.api_state !== CONSTANTS.QUEST_STATUS_COMPLETE)
}

export default {
  state,
  mutations,
  actions,
  getters
}
