
export {}

declare global {
  interface Window {
    /** Expose some Api through preload script */
    bridge: {
      __dirname: string
      __filename: string
      fs: typeof import('fs')
      path: typeof import('path')
      ipcRenderer: import('electron').IpcRenderer,
      desktopCapturer: import('electron').DesktopCapturer,
      removeLoading: () => void,
      event: typeof import('events'),
      Menu: typeof import('@electron/remote').Menu,
      MenuItem: typeof import('@electron/remote').MenuItem
    }
  }
}
