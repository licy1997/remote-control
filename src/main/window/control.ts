import { app, BrowserWindow, ipcMain } from 'electron'
import { initialize, enable as enableRemote } from "@electron/remote/main";
import { join } from 'path'
let win: BrowserWindow 

async function  create() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1000,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      // contextIsolation: false,
      preload: join(__dirname, '../preload/index.cjs')
    },
  })

  enableRemote(win.webContents);
  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html#/control'))
  } else {
    const pkg = await import('../../../package.json')
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}#/control`

    win.loadURL(url)
    win.maximize()
    win.webContents.openDevTools()
  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })
}
function send(channel:string, ...args:any[]) {
  win.webContents.send(channel, ...args)
}

export {
  create,
  send
}