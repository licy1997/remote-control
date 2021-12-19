const menuPop = window.bridge.menuPop

const ipcRenderer = window.bridge.ipcRenderer
import { useState, useEffect } from 'react'
import './peer-puppet'
import './App.css'
import Menu from 'rc-menu/lib/Menu'

function App() {
  const [remoteCode, setRemoteCode] = useState('')
  const [localCode, setLocalcode] = useState('')
  const [controlText, setControlText] = useState('')
  const login = async () => {
    let code = await ipcRenderer.invoke('login')
    setLocalcode(code)
  }
  useEffect(() => {
    login()
    ipcRenderer.on('control-state-change', handleControlState)
    return () => {
      ipcRenderer.removeListener('control-state-change', handleControlState)
    }
  }, [])
  const hadnleContextMenu = (e) => {
    e.preventDefault()
    menuPop()
  }
  const startControl = (remoteCode: string) => {
    ipcRenderer.send('control', remoteCode)
  }
  const handleControlState = (e: Event, name: string, type: number) => {
    let text = ''
    if (type === 1) {
      text = `正在远程控制${name}`
    } else if (type === 2) {
      text = `被${name}控制中`
    }
    setControlText(text)
  }
  return (
    <div className="App">
      {controlText === '' ? (
        <>
          <div>
            你的控制码
            <span onContextMenu={(e) => hadnleContextMenu(e)}>{localCode}</span>
          </div>
          <input
            type="text"
            value={remoteCode}
            onChange={(e) => setRemoteCode(e.target.value)}
          />
          <button onClick={() => startControl(remoteCode)}>确认</button>
        </>
      ) : (
        <div className="">{controlText}</div>
      )}
    </div>
  )
}

export default App
