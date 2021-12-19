const WebSocket = require('ws');
// import WebSocket from 'ws'
// const EventEmitter = require('events')
import EventEmitter from 'events';
const signal = new EventEmitter()
const ws = new WebSocket('ws://192.168.0.72:8010')
ws.on('open', () => {
  console.log('connect success');
})

ws.on('message', (message) => {
  let data = {}
  try{ 
    data = JSON.parse(message)
  }catch(e) {
    console.log('parsser error', e);
  }
  signal.emit(data.event, data.data)
})
function send(event, data) {
  ws.send(JSON.stringify({event, data}))
}

function invoke(event, data, ansower){
  return new Promise((resolve, reject)=> {
    send(event, data)
    signal.once(ansower, resolve)
    setTimeout(() => {
      reject('timeout')
    }, 5000)
  })
}
signal.send = send
signal.invoke = invoke
export default signal