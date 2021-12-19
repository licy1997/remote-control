import { ipcMain } from 'electron'
import { send as sendMainWindow } from './window/main'
import { create as createControlWindow, send as sendControlWindow } from './window/control'
import signal from './signal'
export default function () {
  ipcMain.handle('login', async () => {
    // let code = Math.floor(Math.random() * (99999 - 10000) + 10000)
    let { code } = await signal.invoke('login', null, 'logined')
    return code
  })
  ipcMain.on('control', async (e, remote) => {
    signal.send('control', { remote })
  })
  signal.on('controlled', (data) => {
    createControlWindow()
    sendMainWindow('control-state-change', data.remote, 1)
  })
  signal.on('be-controlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 2)
  })
  // puppet、control共享的信道，就是转发
  ipcMain.on('forward', (e, event, data) => {
    signal.send('forward', { event, data })
  })

  // 收到offer，puppet响应
  signal.on('offer', (data) => {
    sendMainWindow('offer', data)
  })

  // 收到puppet证书，answer响应
  signal.on('answer', (data) => {
    sendControlWindow('answer', data)
  })

  // 收到control证书，puppet响应
  signal.on('puppet-candidate', (data) => {
    sendControlWindow('candidate', data)
  })

  // 收到puppet证书，control响应
  signal.on('control-candidate', (data) => {
    sendMainWindow('candidate', data)
  })
}
