import { ipcMain } from 'electron'
import { send as sendMainWindow } from './window/main'
import {  create as createControlWindow } from './window/control'
export default function () {
  ipcMain.handle('login', async () => {
    let code = Math.floor(Math.random() * (99999 - 10000) + 10000)
    return code
  })
  ipcMain.on('control', async (e, remoteCode) => {
    sendMainWindow('control-state-change', remoteCode, 1)
    createControlWindow()
  })
}
