const fs = require('fs'), path = require('path'), https = require('https')
require('dotenv').config()

console.log('=======================================')
console.log('===== WhoCallsTheFleetDb.js START =====')
console.log('=======================================')

const checkDir = (fpath = '') => {
  console.log(`checking ${fpath}`)
  if (fpath.length === 0 || fpath === '.' || fpath === '/') {
    return
  }
  if (!fs.existsSync(path.dirname(fpath))) {
    checkDir(path.dirname(fpath))
    console.log(`adding dir ${path.dirname(fpath)}`)
    fs.mkdirSync(path.dirname(fpath))
  }
}

let check = async (url, path) => {
  return new Promise((res) => {
    try {
      fs.accessSync(path, fs.constants.R_OK)
      res()
    } catch (Error) {
      console.log(`Downloading ${url}`)
      let data = ''
      https.get(url, (response) => {
        response.setEncoding('utf8')

        response.on('data', (chunk) => {
          data += chunk
        })
        response.on('end', () => {
          data = data.trim()
          checkDir(path)
          fs.writeFileSync(path, data)
          console.log(`Finished ${path} length -> ${data.length}`)
          res()
        })
      })
    }
  })
}

// ["","高速修復材","高速建造材",...]
const KC3TUseItems_jp = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'external', 'KC3T', 'jp', 'useitems.json'), 'utf8')).map((i) => i.trim())

// generating ship -> ship_id list
WCTFShips = require(path.join(__dirname, '..', 'external', 'WCTF', 'ships.js'))
const ships = {}
Object.keys(WCTFShips).map((master_id) => {
  const master = WCTFShips[master_id]
  let name = ''
  if (master.name.ja_jp) {
    name = `${master.name.ja_jp} ${master.name.suffix_jp ? master.name.suffix_jp : ''}`.trim()
  } else {
    name = `${master.name.ja_romaji} ${master.name.suffix_rj ? master.name.suffix_rj : ''}`.trim()
  }
  if (name && name.length) {
    ships[name] = master_id
  }
})

WCTFItems = require(path.join(__dirname, '..', 'external', 'WCTF', 'items.js'))
const items = {}
Object.keys(WCTFItems).map((master_id) => {
  let name = WCTFItems[master_id].name.trim()
  if (name && name.length) {
    items[name] = master_id
  }
})

const parseReward = (reward, quest) => {
  let name = (reward.name || '').trim()
  if (name === '家具箱(中)') {
    name = '家具箱（中）'
  } else if (name === '家具箱(大)') {
    name = '家具箱（大）'
  } else if (name === '家具箱(小)') {
    name = '家具箱（小）'
  }

  if (name && typeof name.category === 'undefined' && typeof items[reward.name.trim()] !== 'undefined') {
    console.warn(`gear category not specified for -> ${quest.game_id}\t${quest.wiki_id}\t${reward.name}`)
    reward.category = '装備'
  }

  if (name.length && KC3TUseItems_jp.indexOf(name) !== -1) {
    return {
      useitem: KC3TUseItems_jp.indexOf(name),
      amount: reward.amount
    }
  } else if (reward.category === '艦娘') {// ship
    if (typeof ships[name] !== 'undefined') {
      return {
        ship: ships[name],
        amount: reward.amount
      }
    } else {
      throw new Error(`Unknow ship reward "${JSON.stringify(reward)}"`)
    }
  } else if (reward.category === '装備') { // equipment
    if (typeof items[name] !== 'undefined') {
      return {
        gear: parseInt(items[name]),
        amount: reward.amount
      }
    } else {
      throw new Error(`Unknow gear reward "${JSON.stringify(reward)}"`)
    }
  } else if (reward.category === '家具') { // furniture
    // FIXME furniture translations? somewhere? anywhere?
    return {
      furniture: name
    }
  } else if (name && name.match(/第\d艦隊開放/)) { // fleet slot
    return {
      fleet: parseInt(name.replace(/[^\d]+/g, ''))
    }
  } else if (name && name.match(/戦果\d+/)) { // ranking points
    return {
      ranking_points: parseInt(name.replace(/[^\d]+/g, ''))
    }
  } else if (name === '遠征「臨時補給」開放') {//resupply on exp page
    return {exp_resupply: true}
  } else if (name === '中部海域「基地航空隊」開放') {//LBAS in world 6
    return {LBAS_W6: true}
  } else if (name === '大型艦建造開放') {//LSC
    return {LSC: true}
  } else if (name === '改修工廠開放') {//akashi repair shop
    return {akashi_repair_shop: true}
  } else if (name.indexOf('★') !== 0) {
    const itemName = name.replace(/★.+$/g, '')
    const itemLvl = name.match(/\+(\d+)/g)[1]

    if (typeof items[itemName.trim()] !== 'undefined') {
      return {
        gear: parseInt(items[itemName.trim()]),
        lvl: itemLvl,
        amount: reward.amount
      }
    } else {
      throw new Error(`Unknow modded gear reward "${JSON.stringify(reward)}"`)
    }
  } else {
    console.log(`${quest.game_id}\t${quest.wiki_id}\t${name}\t"${JSON.stringify(reward)}"`)
  }
}

check('https://raw.githubusercontent.com/poooi/plugin-quest/master/assets/data.json', path.join(__dirname, '..', 'external', 'POOOI', 'poooi_quests.json'))
  .then(() => check('https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/quests.json', path.join(__dirname, '..', 'external', 'KC3T', 'en', 'quests.json')))
  .then(() => check('https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/useitems.json', path.join(__dirname, '..', 'external', 'KC3T', 'en', 'useitems.json')))
  .then(() => check('https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/jp/useitems.json', path.join(__dirname, '..', 'external', 'KC3T', 'jp', 'useitems.json')))
  .then(() => {
    console.log('processing...')
    const quests = {}

    // [{"game_id": 101,....},{},{}]
    const poooiQuests = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'external', 'POOOI', 'poooi_quests.json'), 'utf8'))

    // {"101":{},"102":{},....}
    const KC3TQuests = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'external', 'KC3T', 'en', 'quests.json'), 'utf8'))

    poooiQuests.map((quest) => {
      const kc3_quest = KC3TQuests[quest.game_id] || {}
      quests[quest.game_id] = {
        id: quest.game_id,

        name: {
          jp: quest.name,
          en: kc3_quest.name
        },

        detail: quest.detail,

        description: {
          en: kc3_quest.desc
        },

        wiki_id: quest.wiki_id,

        // if starts with "W" then it's shipfu quest
        wikia_id: kc3_quest.code,

        // 1 - composition
        // 2 - battle
        // 3 - pvp
        // 4 - expedition
        // 5 - supply
        // 6 - construct
        // 7 - Modernization
        category: quest.category,

        // 1 - once
        // 2 - daily
        // 3 - weekly
        // 4 - available on dates ending with -3rd, -7th, or -0th.
        // 5 - available on dates ending with -2nd or -8th.
        // 6 - monthly
        // 7 - quarterly
        repeat: quest.type,
        rewards: {
          rsc: {},
        },
        // quest.requirements
        requires: quest.prerequisite,
        unlocks: kc3_quest.unlock
      }
      if (quest.reward_fuel > 0) {
        quests[quest.game_id].rewards.rsc.fuel = quest.reward_fuel
      }
      if (quest.reward_ammo > 0) {
        quests[quest.game_id].rewards.rsc.ammo = quest.reward_ammo
      }
      if (quest.reward_steel > 0) {
        quests[quest.game_id].rewards.rsc.steel = quest.reward_steel
      }
      if (quest.reward_bauxite > 0) {
        quests[quest.game_id].rewards.rsc.bauxite = quest.reward_bauxite
      }
      
      if (quest.reward_other) {
        const other = []

        quest.reward_other.map((reward) => {
          if (reward.choices) {
            other.push({
              choices: reward.choices.map(c => parseReward(c, quest))
            })
          } else {
            other.push(parseReward(reward, quest))
          }
        })
        if (other.length) {
          quests[quest.game_id].rewards.other = other
        }

      }
    })

    str = '/* eslint-disable */\n'
    if (process.env.CLIENT_MODE === 'DEV') {
      str += 'const quests = ' + JSON.stringify(quests, false, ' ') + '\n'
    } else {
      str += 'const quests = ' + JSON.stringify(quests) + '\n'
    }

    str += 'export default quests'

    fs.writeFileSync(path.join(__dirname, '..', 'src', 'renderer', 'generated', 'quests.js'), str, {encoding: 'utf8'})

    console.log('=======================================')
    console.log('===== WhoCallsTheFleetDb.js END =======')
    console.log('=======================================')
  })
