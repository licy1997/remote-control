import { app, Menu, Tray } from 'electron';
import path from 'path';
import { show as showMainWindow } from '../window/main';
// import { create as createAboutWindow } from '../window/about';

let tray;

export function setTray() {
  tray = new Tray(path.resolve(__dirname, '../../resources/icon_win32@2x.png'))
    const contextMenu = Menu.buildFromTemplate([
        { label: '打开' + app.name, click: showMainWindow},
        // { label: '关于' + app.name, click: createAboutWindow},
        { type: 'separator' },
        { label: '退出', click: () => {app.quit()}}
    ])
    tray.setContextMenu(contextMenu)
}

export function setAppMenu() {
  let menu = Menu.buildFromTemplate([{
    label: 'refresh',
    role: 'reload'
  }])
    app.applicationMenu = menu;

}
