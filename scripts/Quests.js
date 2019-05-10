const fs = require('fs'), path = require('path'), https = require('https')
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

check('https://raw.githubusercontent.com/poooi/plugin-quest/master/assets/data.json', path.join(__dirname, '..', 'external', 'poooi_quests.json'))
  .then(() => {
    console.log('processing...')
    let quests = {}

    str = '/* eslint-disable */\n'
    str += 'const quests=' + JSON.stringify(quests) + '\n'
    str += 'export default quests'

    fs.writeFileSync(path.join(__dirname, '..', 'src', 'renderer', 'generated', 'quests.js'), str, {encoding: 'utf8'})

    console.log('=======================================')
    console.log('===== WhoCallsTheFleetDb.js END =======')
    console.log('=======================================')
  })
