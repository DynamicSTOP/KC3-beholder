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

const validateQuests = (currentTimestamp = (new Date()).getTime()) => {
  const msPerDay = 24 * 60 * 60 * 1000
  const JANUARY = 0
  const FEBRUARY = 1
  const MARCH = 2
  const APRIL = 3
  const MAY = 4
  const JUNE = 5
  const JULY = 6
  const AUGUST = 7
  const SEPTEMBER = 8
  const OCTOBER = 9
  const NOVEMBER = 10
  const DECEMBER = 11

  let lastReset = new Date(currentTimestamp)
  if (lastReset.getUTCHours() < 20) {
    lastReset = new Date(currentTimestamp - msPerDay)
  }
  lastReset.setUTCHours(20)
  lastReset.setUTCMinutes(0)
  lastReset.setUTCSeconds(0)
  lastReset.setUTCMilliseconds(0)

  const lastWeeklyReset = lastReset.getTime() - lastReset.getUTCDay() * msPerDay
  const lastMonthlyReset = lastReset.getTime() - lastReset.getUTCDate() * msPerDay
  let lastQuarterlyReset

  switch (lastReset.getUTCMonth()) {
    case MARCH:
    case APRIL:
    case MAY: {
      lastQuarterlyReset = Date.UTC(lastReset.getUTCFullYear(), MARCH, 0, 20)
      break
    }
    case JUNE:
    case JULY:
    case AUGUST: {
      lastQuarterlyReset = Date.UTC(lastReset.getUTCFullYear(), JUNE, 0, 20)
      break
    }
    case SEPTEMBER:
    case OCTOBER:
    case NOVEMBER: {
      lastQuarterlyReset = Date.UTC(lastReset.getUTCFullYear(), SEPTEMBER, 0, 20)
      break
    }
    case DECEMBER: {
      lastQuarterlyReset = Date.UTC(lastReset.getUTCFullYear(), DECEMBER, 0, 20)
      break
    }
    case JANUARY:
    case FEBRUARY: {
      lastQuarterlyReset = Date.UTC(lastReset.getUTCFullYear() - 1, DECEMBER, 0, 20)
      break
    }
    default:
      throw new Error(`Bad month`)
  }
  lastReset = lastReset.getTime()

  console.debug(`Last Daily Reset ${new Date(lastReset).toISOString()}`)
  console.debug(`Last Weekly Reset ${new Date(lastWeeklyReset).toISOString()}`)
  console.debug(`Last Monthly Reset ${new Date(lastMonthlyReset).toISOString()}`)
  console.debug(`Last Quarterly Reset ${new Date(lastQuarterlyReset).toISOString()}`)

  const filteredQuests = {}
  Object.keys(state.qRawQuests)
    .filter((questId) => questId.match(/\d+/))
    .map((questId) => {
      const quest = state.qRawQuests[questId]
      if (libQuests[quest.api_no] && quest.date < lastReset) {
        if ([CONSTANTS.QUEST_REPEAT_28, CONSTANTS.QUEST_REPEAT_370, CONSTANTS.QUEST_REPEAT_DAILY].indexOf(libQuests[quest.api_no].repeat) !== -1) {
          return // daily
        }
        if (libQuests[quest.api_no].repeat === CONSTANTS.QUEST_REPEAT_WEEKLY && quest.date < lastWeeklyReset) {
          return // weekly
        }
        if (libQuests[quest.api_no].repeat === CONSTANTS.QUEST_REPEAT_MONTHLY && quest.date < lastMonthlyReset) {
          return // monthly
        }
        if (libQuests[quest.api_no].repeat === CONSTANTS.QUEST_REPEAT_QUARTERLY && quest.date < lastQuarterlyReset) {
          return // monthly
        }
      }
      filteredQuests[quest.api_no] = quest
    })
  state.qRawQuests = filteredQuests
  saveToLocalStorage()
}
// on first load, non server date can be tolerated in this case i guess
validateQuests((new Date()).getTime())

let resetTimers = null
const updateTimers = (timestamp = (new Date()).getTime()) => {
  if (resetTimers) {
    clearTimeout(resetTimers)
    resetTimers = null
  }
  let resetTime = new Date(timestamp)
  resetTime.setUTCMinutes(0)
  resetTime.setUTCSeconds(0)
  resetTime.setUTCMilliseconds(0)
  let timeout
  if (resetTime.getUTCHours() < 20) {
    resetTime.setUTCHours(20)
    timeout = resetTime.getTime() - timestamp
  } else {
    const msPerDay = 24 * 60 * 60 * 1000
    resetTime.setUTCHours(20)
    timeout = resetTime.getTime() + msPerDay - timestamp
  }
  timeout += 1000
  const hours = Math.floor(timeout / (60 * 60 * 1000))
  const mins = Math.floor((timeout - hours * 60 * 60 * 1000) / (60 * 1000))
  const secs = Math.floor((timeout - hours * 60 * 60 * 1000 - mins * 60 * 1000) / (1000))
  console.debug(`quest will be invalidated in ${hours}:${mins}:${secs}.${timeout % 1000}`)
  resetTimers = setTimeout(() => {
    console.debug(`quest invalidation!`)
    validateQuests()
    updateTimers()
  }, timeout)
}
updateTimers()

function saveToLocalStorage () {
  localStorage.questsState = JSON.stringify(state)
}

const mutations = {
  PARSE_QUESTS_LIST (state, data) {
    const {responseBody, headers} = data
    const {api_data} = responseBody
    const {api_list} = api_data
    const JPDate = (new Date(headers.date)).getTime()
    updateTimers(JPDate)
    const newQuests = {}
    api_list.filter((q) => q !== -1).map((rawQuest) => {
      rawQuest.date = JPDate
      newQuests[rawQuest.api_no] = rawQuest
    })
    // i am not crazy, you are crazy
    // https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats
    state.qRawQuests = Object.assign({}, state.qRawQuests, newQuests)
    state.qLastCheck = JPDate
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
