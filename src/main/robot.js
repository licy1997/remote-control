const robot = require('robotjs')
import { ipcMain } from 'electron'
const vkey = require('vkey')
/**
 *
 * @param {Object} data
 */
function handleMouse(data) {
  let { clientX, clientY, screen, video } = data
  let x = (clientX * screen.width) / video.width
  let y = (clientY * screen.height) / video.height
  robot.moveMouse(x, y)
  robot.mouseClick()
}
function handleKey(data) {
  const modifiers = []
  if (data.meta) modifiers.push('meta')
  if (data.shift) modifiers.push('shift')
  if (data.alt) modifiers.push('alt')
  if (data.control) modifiers.push('ctrl')
  let key = vkey[data.keyCode].toLowerCase()
  if (key[0] !== '<') {
    robot.keyTap(key, modifiers)
  }
}
export default function () {
  ipcMain.on('robot', (e, type, data) => {
    if (type === 'mouse') {
      handleMouse(data)
    } else if (type === 'key') {
      handleKey(data)
    }
  })
}
