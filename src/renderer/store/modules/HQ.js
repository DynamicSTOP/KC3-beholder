/* eslint camelcase: ["error", {allow: ["^api_"]}] */
// ^ this is kc devs to blame, not me
import WCTFShips from '@/generated/ships'
import WCTFItems from '@/generated/items'

const state = {
  api_basic_raw: {},
  hq: {
    rank: {
      id: 0,
      points: 0,
      ptLastCheck: 0,
      ptLastCount: 0,
      ptCutoff: 0,
      ptLastTimestamp: 0
    },
    comment: '',
    level: 0,
    nickname: '',
    exp: 0,
    rankPoints: 0,
    maxShips: 0,
    maxGears: 0,
    materials: {
      fuel: 0,
      ammo: 0,
      steel: 0,
      baux: 0,
      buckets: 0
    }
  },
  decks: [],
  ships: [],
  gears: [],
  docks: []
}

if (localStorage.hqState) {
  try {
    Object.assign(state, JSON.parse(localStorage.hqState))
  } catch (e) {
    console.error(e)
  }
}

function saveToLocalStorage () {
  localStorage.hqState = JSON.stringify(state)
}

function rankCutOff () {
  state.hq.rank.ptLastTimestamp = Date.now()
  if (state.hq.rank.ptCutoff === 0) {
    state.hq.rank.ptCutoff = getters.hqExp(state)
  }
  state.hq.rank.ptLastCount = getters.hqRankPoints(state)
  state.hq.rank.ptCutoff = getters.hqExp(state)
}

function checkRankCutOff (dateObj, hr) {
  dateObj.setUTCHours(hr)
  const PvPResetTime = dateObj.getTime()
  if (state.hq.rank.ptLastCheck < PvPResetTime && PvPResetTime < Date.now()) {
    rankCutOff()
  }
}

function checkRankPoints () {
  const PvPReset = (new Date())
  PvPReset.setUTCMinutes(0)
  PvPReset.setUTCSeconds(0)
  PvPReset.setUTCMilliseconds(0)

  const lastDay = new Date(Date.UTC(PvPReset.getUTCFullYear(), PvPReset.getUTCMonth() + 1, 0))
  // If this is the last day of the month
  if (PvPReset.getUTCDate() === lastDay.getUTCDate()) {
    // At morning, check 0500 UTC = 1400 JST
    // At night, check 1300 UTC = 2200 JST: Montly points reset
    // At night, check 1700 UTC = 0200 JST: First cycle end, start second cycle
    checkRankCutOff(PvPReset, 5)
    checkRankCutOff(PvPReset, 13)
    checkRankCutOff(PvPReset, 17)
  } else {
    // Not last day of the month..
    // At morning, check 0500 UTC = 1400 JST
    // At night, check 1700 UTC = 0200 JST
    checkRankCutOff(PvPReset, 5)
    checkRankCutOff(PvPReset, 17)
  }
  state.hq.rank.ptLastCheck = Date.now()
}

const mutations = {
  HQ_PARSE_PORT_DATA (state, data) {
    // eslint-disable-next-line camelcase
    const {api_basic, api_material, api_ship, api_deck_port, api_ndock} = data
    state['api_basic_raw'] = api_basic

    state.hq.rank.id = api_basic.api_rank
    state.hq.comment = api_basic.api_comment
    state.hq.level = api_basic.api_level
    state.hq.nickname = api_basic.api_nickname
    state.hq.exp = api_basic.api_experience
    state.hq.rankPoints = getters.hqRankPoints(state)
    state.hq.maxShips = api_basic.api_max_chara
    state.hq.maxGears = api_basic.api_max_slotitem + 3

    state.hq.materials.fuel = api_material.filter(r => r.api_id === 1)[0].api_value
    state.hq.materials.ammo = api_material.filter(r => r.api_id === 2)[0].api_value
    state.hq.materials.steel = api_material.filter(r => r.api_id === 3)[0].api_value
    state.hq.materials.baux = api_material.filter(r => r.api_id === 4)[0].api_value
    state.hq.materials.buckets = api_material.filter(r => r.api_id === 6)[0].api_value

    state.ships = api_ship

    state.docks = api_ndock.sort((a, b) => a.api_id - b.api_id)
      .map((dockData) => {
        return {shipId: dockData.api_ship_id}
      })

    state.decks = {}
    api_deck_port.map((deck) => {
      state.decks[deck.api_id - 1] = {
        ships: deck.api_ship.filter(shipId => shipId > 0)
      }
    })

    checkRankPoints()
    saveToLocalStorage()
  },
  HQ_PARSE_DECK_BATTLE_UPDATE (state, shipsData) {
    state.ships.map((stateShipData, index) => {
      const updateData = shipsData.filter(shipData => shipData.api_id === stateShipData.api_id)
      if (updateData.length > 0) {
        state.ships[index] = updateData[0]
      }
    })
  },
  HQ_PARSE_GEAR_DATA (state, data) {
    state.gears = data
    saveToLocalStorage()
  }
}

const actions = {
  HQ_PARSE_PORT_DATA (context, data) {
    context.commit('HQ_PARSE_PORT_DATA', data)
  },
  HQ_PARSE_GEAR_DATA (context, data) {
    context.commit('HQ_PARSE_GEAR_DATA', data)
  },
  HQ_PARSE_DECK_BATTLE_UPDATE (context, data) {
    context.commit('HQ_PARSE_DECK_BATTLE_UPDATE', data)
  }
}

const getters = {
  hqRankId: state => state.hq.rank.id,
  hqComment: state => state.hq.comment,
  hqLevel: state => state.hq.level,
  hqNickname: state => state.hq.nickname,
  hqExp: state => state.hq.exp,
  hqRankPoints: state => (getters.hqExp(state) - state.hq.rank.ptCutoff) * 7 / 10000,
  hqMaxShips: state => state.hq.maxShips,
  hqMaxGears: state => state.hq.maxGears,
  hqFuel: state => state.hq.materials.fuel,
  hqAmmo: state => state.hq.materials.ammo,
  hqSteel: state => state.hq.materials.steel,
  hqBaux: state => state.hq.materials.baux,
  hqBuckets: state => state.hq.materials.buckets,
  shipCount: state => state.ships.length,
  gearCount: state => state.gears.length,
  deckShipIds: state => deckId => state.decks[deckId].ships,
  docks: state => state.docks,
  /* ship data for different templates in one place */
  ship: state => shipId => state.ships.filter(ship => ship.api_id === shipId)[0],
  gear: state => gearId => state.gears.filter(gear => gear.api_id === gearId)[0],
  shipData: state => shipId => getters.ship(state)(shipId),
  shipLvL: state => shipId => getters.shipData(state)(shipId).api_lv,
  shipMorale: state => shipId => getters.shipData(state)(shipId).api_cond,
  shipMasterId: state => shipId => getters.shipData(state)(shipId).api_ship_id,
  shipMaster: state => shipId => WCTFShips[getters.shipMasterId(state)(shipId)] || {},
  shipGearIds: state => shipId => getters.shipData(state)(shipId).api_slot,
  shipGears: state => shipId => getters.shipGearIds(state)(shipId).map(gearId => gearId > 0 ? getters.gear(state)(gearId) : {}),
  shipGearTypes: state => shipId => getters.shipGears(state)(shipId).map(gear => gear && gear.api_slotitem_id ? WCTFItems[gear.api_slotitem_id].types[3] : 0),
  shipGearLvls: state => shipId => getters.shipGears(state)(shipId).map(gear => gear.api_level ? gear.api_level : 0),
  shipExtraGearId: state => shipId => getters.shipData(state)(shipId).api_slot_ex,
  shipExtraGear: state => shipId => getters.shipExtraGearId(state)(shipId) > 0 ? getters.gear(state)(getters.shipExtraGearId(state)(shipId)) : {},
  shipExtraGearType: state => shipId => getters.shipExtraGear(state)(shipId) && getters.shipExtraGear(state)(shipId).api_slotitem_id ? WCTFItems[getters.shipExtraGear(state)(shipId).api_slotitem_id].types[3] : 0,
  shipPlanesInSlot: state => shipId => getters.shipData(state)(shipId).api_onslot,
  shipPlanesInMasterSlot: state => shipId => getters.shipMaster(state)(shipId).slot,
  shipExtraSlotOpen: state => shipId => getters.shipData(state)(shipId).api_slot_ex !== 0,
  shipIsInDock: state => shipId => getters.docks(state).filter(d => d.shipId === shipId).length !== 0,
  shipHpCurrent: state => shipId => getters.shipData(state)(shipId).api_nowhp,
  shipHpMax: state => shipId => getters.shipData(state)(shipId).api_maxhp,
  shipSlotsNumber: state => shipId => getters.shipData(state)(shipId).api_slotnum,
  shipName: state => shipId => {
    const master = getters.shipMaster(state)(shipId)
    if (typeof master.name === 'undefined') return 'NewFace'
    if (master.name.ja_romaji) {
      return `${master.name.ja_romaji} ${master.name.suffix_rj ? master.name.suffix_rj : ''}`.trim()
    } else {
      return `${master.name.ja_jp} ${master.name.suffix_jp ? master.name.suffix_jp : ''}`.trim()
    }
  },
  shipLvLCss: state => shipId => {
    const lvl = getters.shipData(state)(shipId).api_lv
    if (lvl > 99) {
      return 'lvl_married'
    } else if (lvl >= 80) {
      return 'lvl_80'
    } else if (lvl >= 60) {
      return 'lvl_60'
    }
  },
  shipHpBarCount: state => shipId => {
    const bars = Math.ceil((getters.shipData(state)(shipId).api_nowhp / getters.shipData(state)(shipId).api_maxhp) / 0.25)
    if (bars === 0 && getters.shipData(state)(shipId).api_nowhp > 0) {
      return 1
    } else {
      return bars
    }
  },
  shipMoraleState: state => shipId => {
    const morale = getters.shipMorale(state)(shipId)
    if (morale >= 50) {
      return 'morale_high'
    } else if (morale >= 40) {
      return 'morale_normal'
    } else if (morale >= 20) {
      return 'morale_low'
    } else {
      return 'morale_very-low'
    }
  },
  shipFuel: state => shipId => getters.shipData(state)(shipId).api_fuel,
  shipAmmo: state => shipId => getters.shipData(state)(shipId).api_bull,
  shipMaxFuel: state => shipId => getters.shipMaster(state)(shipId).consum.fuel,
  shipMaxAmmo: state => shipId => getters.shipMaster(state)(shipId).consum.ammo
}

export default {
  state,
  mutations,
  actions,
  getters
}
