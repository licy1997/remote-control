import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import handleIPC from '../ipc'
import robot from '../robot'
import initTrayAndMenu from '../trayAndMenu/index'
import { initialize, enable as enableRemote } from "@electron/remote/main";
let win: BrowserWindow
let willQuitApp = false
async function create() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 600,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.cjs'),
    },
  })
  initialize()
  enableRemote(win.webContents);
  win.on('close', (e) => {
    
    if (willQuitApp) {
      win = null
    } else {
      e.preventDefault()
      win.hide()
    }
  })
  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    const pkg = await import('../../../package.json')
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`

    win.loadURL(url)
    win.maximize()
    win.webContents.openDevTools()

  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })
  handleIPC()
  robot()
  initTrayAndMenu()
}

function send(channel: string, ...args: any[]) {
  win.webContents.send(channel, ...args)
}

function show() {
  win.show()
}
function close() {
  willQuitApp = true
  win.close()
}
export { create, send, show, close }
