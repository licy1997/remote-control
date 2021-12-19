import { app, Menu, Tray } from 'electron'
import { show as showMainWindow } from '../window/main'
import path from 'path'
// import { create as createAboutWindow } from '../window/about'
let tray: Tray

export function setTray() {
  tray = new Tray(path.resolve(__dirname, './icon_drawin.png'))
  tray.on('click', () => {
    showMainWindow()
  })
  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      { label: '显示', click: showMainWindow },
      { label: '退出', click: app.quit },
    ])
    tray.popUpContextMenu(contextMenu)
  })
}

export function setAppMenu() {
  let appMenu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        // {
        //   label: 'About',
        //   click: createAboutWindow,
        // },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    { role: 'fileMenu' },
    { role: 'windowMenu' },
    { role: 'editMenu' },
  ])
  app.applicationMenu = appMenu
}
