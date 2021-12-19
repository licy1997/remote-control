import fs from 'fs'
import path from 'path'

import { contextBridge, ipcRenderer, desktopCapturer } from 'electron'
import { Menu, MenuItem } from '@electron/remote'

function menuPop() {
  const menu = new Menu()
  menu.append(new MenuItem({ label: '复制', role: 'copy' }))
  menu.popup()
}

import { domReady } from './utils'
import { useLoading } from './loading'

const isDev = process.env.NODE_ENV === 'development'
const { appendLoading, removeLoading } = useLoading()

;(async () => {
  await domReady()

  appendLoading()
})()

// ---------------------------------------------------
// window._remote = remote
contextBridge.exposeInMainWorld('bridge', {
  __dirname,
  __filename,
  fs,
  path,
  ipcRenderer: withPrototype(ipcRenderer),
  removeLoading,
  desktopCapturer: withPrototype(desktopCapturer),
  remote:{
    Menu:clone(Menu), 
    MenuItem:clone(MenuItem)
  },
  menuPop
  // remote
})

// `exposeInMainWorld` can not detect `prototype` attribute and methods, manually patch it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native API not work in Renderer-process, like `NodeJS.EventEmitter['on']`. Wrap a function patch it.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}

function clone(data:any){
  if(typeof data==='symbol'){           //Symbol
    return Symbol.for(data.description);
  }else if(typeof data!='object'){      //基本类型
    return data;
  }else if(data instanceof Array){      //Array
    return data.map(item=>clone(item));
  }else if(data.constructor===Object){   //Json
    let res={};
    for(let key in data){
      res[key]=clone(data[key]);
    }
    return res;
  }else{                                //系统对象、自定义对象
    return new data.constructor(data);
  }
}

