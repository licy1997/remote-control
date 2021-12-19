import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Control from './Control'
import { 
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  HashRouter
} from "react-router-dom";
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
    <Routes>
      <Route path="/" element={<App></App>}></Route>
      <Route path="/control" element={<Control></Control>}></Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root'),
  () => {
    window.bridge.removeLoading()
  },
)

// -----------------------------------------------------------

console.log('contextBridge ->', window.bridge)

// Use ipcRenderer.on
window.bridge.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})

// Use 'electron-store'
const store = {
  async get(key) {
    const { invoke } = window.bridge.ipcRenderer
    let value = await invoke('electron-store', 'get', key)
    try {
      value = JSON.parse(value)
    } finally {
      return value
    }
  },
  async set(key, value) {
    const { invoke } = window.bridge.ipcRenderer
    let val = value
    try {
      if (value && typeof value === 'object') {
        val = JSON.stringify(value)
      }
    } finally {
      await invoke('electron-store', 'set', key, val)
    }
  },
};
(async () => {
  await store.set('Date.now', Date.now())
  console.log('electron-store ->', 'Date.now:', await store.get('Date.now'))
  console.log('electron-store ->', 'path:', await window.bridge.ipcRenderer.invoke('electron-store', 'path'))
})();
