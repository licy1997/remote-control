import { join } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import Store from 'electron-store'
import handleIPC from './ipc'
import { create } from './window/main'
app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function mainWin() {
  create()
  
  handleIPC()

}

app.whenReady().then(mainWin)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    // Someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

// -------------------------------------

/**
 * Expose 'electron-store' to renderer through 'ipcMain.handle'
 */
const store = new Store
ipcMain.handle('electron-store', async (_evnet, methodSign: string, ...args: any[]) => {
  if (typeof (store as any)[methodSign] === 'function') {
    return (store as any)[methodSign](...args)
  }
  return (store as any)[methodSign]
})
