/**
 * The general idea of this file is:
 *  - load local versions file
 *  - load github master versions e.g. use https://api.github.com/repos/KC3Kai/KC3Kai/branches/master
 *  - check if github version and local are different
 *  - if so, drop local cached WCTF and update versions file
 *
 *  in the end it will remove need of doing 100500 unnecessary requests
 */

const fs = require('fs'), https = require('https'), path = require('path')
require('dotenv').config()

const deleteRecursive = (fpath = '') => {
  console.log(`dropping ${fpath}`)
  if (fpath.length === 0 || fpath === '.' || fpath === '/') {
    return
  }
  let dontRmDir = false
  if (fs.existsSync(fpath)) {
    if (fs.lstatSync(fpath).isDirectory()) {
      fs.readdirSync(fpath).forEach(function (file, index) {
        if (deleteRecursive(path.join(fpath, file))) {
          dontRmDir = true
        }
      })
      if (!dontRmDir) {
        // fs.rmdirSync(path)  
      }
    } else {
      if (fpath.indexOf('.gitignore') === -1) {
        // fs.unlinkSync(path)
      } else {
        dontRmDir = true
      }
    }
  }
  return dontRmDir
}

console.log('============================')
console.log('===== cleaner.js START =====')
console.log('============================')
let versions = {
  WCTF: '',
  WCTF_date: '',
  poooi: '',
  poooi_date: '',
  KC3T: '',
  KC3T_date: ''
}
let update = false
try {
  fs.accessSync(path.join(__dirname, '..', 'external', '.versions.json'), fs.constants.R_OK)
  versions = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'external', '.versions.json')))
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
load('/repos/KC3Kai/kc3-translations/commits?sha=master&path=data/')
  .then((KC3Tdata) => {
    let force = false
    try {
      console.log(`KC3 translation version ${KC3Tdata[0].sha}`)
    } catch (e) {
      force = true
      console.log(`can't read version from ${JSON.stringify(KC3Tdata)}`)
    }
    if (force || versions.KC3T !== KC3Tdata[0].sha) {
      console.log(`Dropping translations`)
      deleteRecursive(path.join(__dirname, '..', 'external', 'KC3T'))
      versions.KC3T = force ? '' : KC3Tdata[0].sha
      versions.KC3T_date = force ? '' : KC3Tdata[0].commit.author.date
      update = true
    }
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
      deleteRecursive(path.join(__dirname, '..', 'external', 'WCTF'))
      versions.WCTF = force ? '' : WCTFdata[0].sha
      versions.WCTF_date = force ? '' : WCTFdata[0].commit.author.date
      update = true
    }
  })
  .then(() => load('/repos/poooi/plugin-quest/commits?sha=master&path=/assets/data.json'))
  .then((POOOIdata) => {
    let force = false
    try {
      console.log(`POOOI version ${POOOIdata[0].sha}`)
    } catch (e) {
      force = true
      console.log(`can't read version from ${JSON.stringify(POOOIdata)}`)
    }
    if (force || versions.poooi !== POOOIdata[0].sha) {
      console.log(`Dropping POOOI quests`)
      deleteRecursive(path.join(__dirname, '..', 'external', 'POOOI'))
      versions.poooi = force ? '' : POOOIdata[0].sha
      versions.poooi_date = force ? '' : POOOIdata[0].commit.author.date
      update = true
    }
  }).then(() => {
  if (update) fs.writeFileSync(path.join(__dirname, '..', 'external', '.versions.json'), JSON.stringify(versions), {encoding: 'utf8'})
  console.log('============================')
  console.log('===== cleaner.js END =======')
  console.log('============================')
})
