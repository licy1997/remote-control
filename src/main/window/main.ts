import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
let win: BrowserWindow 

async function  create() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 600,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.cjs')
    },
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