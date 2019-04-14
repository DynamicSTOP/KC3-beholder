/**
 * The general idea of this file is:
 *  - load local versions file
 *  - load github master versions e.g. use https://api.github.com/repos/KC3Kai/KC3Kai/branches/master
 *  - check if github version and local are different
 *  - if so, drop local cached WCTF and update versions file
 *
 *  in the end it will remove need of doing 100500 unnecessary requests
 */

const fs = require('fs'), https = require('https')
require('dotenv').config()
console.log('============================')
console.log('===== cleaner.js START =====')
console.log('============================')
let versions = {
  WCTF: '',
  WCTF_date: ''
}
let update = false
try {
  fs.accessSync(__dirname + '/../external/.versions.json', fs.constants.R_OK)
  versions = JSON.parse(fs.readFileSync(__dirname + '/../external/.versions.json'))
} catch (e) {
}

const defOptions = {
  protocl: 'https',
  hostname: 'api.github.com',
  path: '/',
  headers: {}
}

if (process.env.GITHUB_USERNAME) {
  defOptions.headers['User-Agent'] = `${process.env.GITHUB_USERNAME}`
}
if (process.env.GITHUB_TOKEN) {
  defOptions.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
}

let load = async (path) => {
  return new Promise((res) => {
    console.log(`Requesting ${path}`)
    let data = ''
    const options = Object.assign({}, defOptions)
    options.path = path

    https.get(options, (response) => {
      response.setEncoding('utf8')
      response.on('data', (chunk) => {
        data += chunk
      })
      response.on('end', () => {
        data = data.trim()
        console.log(`Finished ${path} length -> ${data.length}`)
        res(JSON.parse(data))
      })
    })
  })
}

//https://developer.github.com/v3/repos/commits/
load('/repos/KC3Kai/KC3Kai/commits?sha=master&path=src/assets/img/ships/')
  .then((KC3data) => {
    let force = false
    try {
      console.log(`KC3 images version ${KC3data[0].sha}`)
    } catch (e) {
      force = true
      console.log(`can't read version from ${JSON.stringify(KC3data)}`)
    }
    // if (force || versions.KC3 !== KC3data[0].sha) {
    //   console.log(`Dropping avatars`)
    //   fs.readdirSync(__dirname + '/../src/images/ships')
    //     .filter((s) => s.indexOf('png') !== -1)
    //     .map((s) => {
    //       fs.unlinkSync(__dirname + '/../src/images/ships/' + s)
    //     })
    //   versions.KC3 = force ? '' : KC3data[0].sha
    //   versions.KC3_date = force ? '' : KC3data[0].commit.author.date
    //   update = true
    // }
  })
  .then(() => load('/repos/TeamFleet/WhoCallsTheFleet/commits?sha=master&path=app-db/'))
  .then((WCTFdata) => {
    let force = false
    try {
      console.log(`WCTF version ${WCTFdata[0].sha}`)
    } catch (e) {
      force = true
      console.log(`can't read version from ${JSON.stringify(WCTFdata)}`)
    }
    if (force || versions.WCTF !== WCTFdata[0].sha) {
      console.log(`Dropping WCTF db`)
      fs.readdirSync(__dirname + '/../external')
        .filter((s) => s.indexOf('nedb') !== -1)
        .map((s) => {
          fs.unlinkSync(__dirname + '/../external/' + s)
        })
      versions.WCTF = force ? '' : WCTFdata[0].sha
      versions.WCTF_date = force ? '' : WCTFdata[0].commit.author.date
      update = true
    }
  }).then(() => {
  if (update) fs.writeFileSync(__dirname + '/../external/.versions.json', JSON.stringify(versions), {encoding: 'utf8'})
  console.log('============================')
  console.log('===== cleaner.js END =======')
  console.log('============================')
})
