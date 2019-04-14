const fs = require('fs'), https = require('https')
require('dotenv').config()

console.log('=======================================')
console.log('===== WhoCallsTheFleetDb.js START =====')
console.log('=======================================')

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
          fs.writeFileSync(path, data)
          console.log(`Finished ${path} length -> ${data.length}`)
          res()
        })
      })
    }
  })
}

check('https://raw.githubusercontent.com/TeamFleet/WhoCallsTheFleet/master/app-db/ships.nedb', __dirname + '/../external/ships.nedb')
  .then(() => check('https://raw.githubusercontent.com/TeamFleet/WhoCallsTheFleet/master/app-db/item_types.nedb', __dirname + '/../external/item_types.nedb'))
  .then(() => check('https://raw.githubusercontent.com/TeamFleet/WhoCallsTheFleet/master/app-db/ship_types.nedb', __dirname + '/../external/ship_types.nedb'))
  .then(() => check('https://raw.githubusercontent.com/TeamFleet/WhoCallsTheFleet/master/app-db/ship_namesuffix.nedb', __dirname + '/../external/ship_namesuffix.nedb'))
  .then(() => check('https://raw.githubusercontent.com/TeamFleet/WhoCallsTheFleet/master/app-db/items.nedb', __dirname + '/../external/items.nedb'))
  .then(() => check('https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/items.json', __dirname + '/../external/items.json'))
  .then(() => check('https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/equiptype.json', __dirname + '/../external/equiptype.json'))

  .then(() => {
    console.log(`Processing...`)
    let stypes = {}
    const rawTypes = fs.readFileSync(__dirname + '/../external/ship_types.nedb', 'utf8')
    rawTypes.split('\n').map((raw_type) => {
      raw_type = JSON.parse(raw_type)
      stypes[`s${raw_type.id}`] = raw_type.code
    })
    stypes[`s7`] = 'FBB'
    stypes[`s11`] = 'CVB'
    stypes[`s34`] = 'CL'

    let suff = {}
    const rawSuff = fs.readFileSync(__dirname + '/../external/ship_namesuffix.nedb', 'utf8')
    rawSuff.split('\n').map((raw_suff) => {
      raw_suff = JSON.parse(raw_suff)
      suff[`s${raw_suff.id}`] = raw_suff
    })

    let itemTypes = {}
    const rawItemTypes = fs.readFileSync(__dirname + '/../external/item_types.nedb', 'utf8')
    rawItemTypes.split('\n').map((raw_ItemTypes) => {
      raw_ItemTypes = JSON.parse(raw_ItemTypes)
      itemTypes[`t${raw_ItemTypes.id}`] = raw_ItemTypes
    })
    dlc_ships = itemTypes[`t38`].equipable_on_type

    const rawShips = fs.readFileSync(__dirname + '/../external/ships.nedb', 'utf8')
    let obj = {}
    rawShips.split('\n').map((master) => {
      master = JSON.parse(master)
      if (master.no === 0) return
      let ship = {
        id: master.id,
        no: master.no,
        stype: master.type,
        name: {
          ja_jp: master.name.ja_jp.split(' ').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
        },
        stat: {
          fast: Number(master.stat.speed) === 10,
          range: master.stat.range,
          fire: master.stat.fire,
          fire_max: master.stat.fire_max,
          torpedo: master.stat.torpedo,
          torpedo_max: master.stat.torpedo_max,
          aa: master.stat.aa,
          aa_max: master.stat.aa_max,
          asw: master.stat.asw,
          asw_max: master.stat.asw_max,
          hp: master.stat.hp,
          hp_max: master.stat.hp_max,
          armor: master.stat.armor,
          armor_max: master.stat.armor_max,
          luck: master.stat.luck,
          luck_max: master.stat.luck_max,
          los: master.stat.los,
          los_max: master.stat.los_max,
          evasion: master.stat.evasion,
          evasion_max: master.stat.evasion_max,
        },
        consum: master.consum,
        slot: master.slot,
        api_typen: stypes[`s${master.type}`].toUpperCase(),
      }
      if (master.additional_item_types && master.additional_item_types.length > 0) {
        ship.daihatsu = master.additional_item_types.indexOf(38) !== -1
      }
      if (dlc_ships.indexOf(master.type) !== -1) {
        ship.daihatsu = true
      }
      if (master.additional_disable_item_types && master.additional_disable_item_types.length > 0) {
        ship.daihatsu = master.additional_disable_item_types.indexOf(38) !== -1
      }

      if (typeof master.name.ja_romaji !== 'undefined') {
        ship.name.ja_romaji = master.name.ja_romaji.split(' ').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
      }
      if (master.name.suffix !== null) {
        ship.name.suffix_rj = suff[`s${master.name.suffix}`].ja_romaji.split(' ').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
      }
      if (master.name.suffix !== null) {
        ship.name.suffix_jp = suff[`s${master.name.suffix}`].ja_jp
      }

      obj[ship.id] = ship
    })

    let str = '/* eslint-disable */\n'
    str += 'const ships=' + JSON.stringify(obj, false, ' ') + '\n'
    str += 'export default ships'

    fs.writeFileSync(__dirname + '/../src/renderer/generated/ships.js', str, {encoding: 'utf8'})

    let items = {}
    let itemTranslations = fs.readFileSync(__dirname + '/../external/items.json', 'utf8')
    itemTranslations = JSON.parse(itemTranslations)

    const rawItems = fs.readFileSync(__dirname + '/../external/items.nedb', 'utf8')
    rawItems.split('\n').map((rawItem) => {
      rawItem = JSON.parse(rawItem)

      items[`${rawItem.id}`] = {
        id: rawItem.id,
        types: rawItem.type_ingame,
        type: rawItem.type,
        name: itemTranslations[rawItem.name.ja_jp] || rawItem.name.ja_jp,
        stat: {
          aa: rawItem.stat.aa,
          ar: rawItem.stat.armor,
          tp: rawItem.stat.torpedo,
          fp: rawItem.stat.fire,
          as: rawItem.stat.asw,
          dv: rawItem.stat.bomb,
          radius: rawItem.stat.distance,
          ev: rawItem.stat.evasion,
          ht: rawItem.stat.hit,
          los: rawItem.stat.los,
          range: rawItem.stat.range
        },
      }
    })

    str = '/* eslint-disable */\n'
    str += 'const items=' + JSON.stringify(items, false, ' ') + '\n'
    str += 'export default items'
    fs.writeFileSync(__dirname + '/../src/renderer/generated/items.js', str, {encoding: 'utf8'})

    let itemTypeNames = fs.readFileSync(__dirname + '/../external/equiptype.json', 'utf8')
    itemTypeNames = JSON.parse(itemTypeNames)
    str = '/* eslint-disable */\n'
    str += 'const itemTypes=' + JSON.stringify(itemTypeNames) + '\n'
    str += 'export default itemTypes'
    fs.writeFileSync(__dirname + '/../src/renderer/generated/item_types.js', str, {encoding: 'utf8'})

    console.log('=======================================')
    console.log('===== WhoCallsTheFleetDb.js END =======')
    console.log('=======================================')

  }, (e) => console.log(e))

