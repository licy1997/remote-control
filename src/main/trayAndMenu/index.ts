import {setTray,  setAppMenu} from './darwin'
import {setTray as winSetTray,  setAppMenu as winSetAppMenu} from './win32'
let initTrayAndMenu = ()=>{}
if(process.platform === 'darwin') {
  initTrayAndMenu = () => {
    setTray()
    setAppMenu()
  }
}else if(process.platform === 'win32') {
  initTrayAndMenu = () => {
    winSetTray()
    winSetAppMenu()
  }
}else {

}

export default initTrayAndMenu