const kccdp = module.exports = {
  init,
  send,
  show,
  toggleDevTools,
  win: null
}

const path = require('path')
const electron = require('electron')

function init () {
  const win = kccdp.win = new electron.BrowserWindow({
    backgroundColor: '#1E1E1E',
    backgroundThrottling: false, // do not throttle animations/timers when page is background
    center: true,
    fullscreen: false,
    fullscreenable: false,
    height: 150,
    maximizable: false,
    minimizable: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    title: 'kccdp-hidden-window',
    useContentSize: true,
    width: 150
  })

  win.loadURL('file://' + path.join(__dirname, '..', 'static', 'kccdp.html'))

  win.on('close', function (e) {
    // if (electron.app.isQuitting) {
    //     return
    // }
    // e.preventDefault()
    // win.hide()
  })
  toggleDevTools()
}

function show () {
  if (!kccdp.win) return
  kccdp.win.show()
}

function send (...args) {
  if (!kccdp.win) return
  kccdp.win.send(...args)
}

function toggleDevTools () {
  if (!kccdp.win) return
  if (kccdp.win.webContents.isDevToolsOpened()) {
    kccdp.win.webContents.closeDevTools()
    kccdp.win.hide()
  } else {
    kccdp.win.webContents.openDevTools({mode: 'detach'})
  }
}
