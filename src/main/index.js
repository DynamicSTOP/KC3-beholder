'use strict'

import {app, BrowserWindow, ipcMain} from 'electron'
import DRP from './dcrp'
import chromePipe from './ChromePipe'
import {URLSearchParams} from 'url'

const fs = require('fs')
const path = require('path')
// for old node < 10
global.URLSearchParams = URLSearchParams

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

chromePipe.on('ConnectedToChrome', (m) => {
  if (mainWindow) {
    mainWindow.send('ConnectedToChrome', m)
  }
  DRP.start()
})

chromePipe.on('ReceivedTextMessage', (message) => {
  if (mainWindow) {
    mainWindow.send('NewNetworkMessage', message)
    if (process.env.NODE_ENV === 'development') {
      const url = message.data.url
      const match = url.match(/https?:\/\/[^/]*(.*)/)
      if (match === null) {
        return console.error('ERROR MATCHING URL ' + url + ' ' + JSON.stringify(message))
      }
      fs.writeFileSync(path.join(__dirname, '..', 'tmp',
        match[1].substring(1).replace(/\//g, '-') + '.json'),
        JSON.stringify(message, false, ' '), {encoding: 'utf8'})
    }
  }
})

ipcMain.on('connectToChrome', (event, data) => {
  chromePipe.connectToChrome(data)
})

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 942,
    useContentSize: true,
    width: 1300
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('message', (message) => {
    if (message.type === 'start_kcpipe') {
      chromePipe.connectToChrome()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
