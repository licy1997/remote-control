import { EventEmitter } from 'events'
const ipcRenderer = window.bridge.ipcRenderer
const desktopCapturer = window.bridge.desktopCapturer
const peer = new EventEmitter()
console.log(peer)

// peer.on('robot', (type,data) => {
//   if(type === 'mouse') {
//     data.screen = {
//       width: window.screen.width,
//       height: window.screen.height
//     }
//   }
//   // setTimeout(()=> {
//   ipcRenderer.send('robot',type,data)

//   // },2000)
// })
const pc = new window.RTCPeerConnection({})
const dc = pc.createDataChannel('robotchannel', { reliable: false })
dc.onopen = function () {
  peer.on('robot', (type, data) => {
    dc.send(JSON.stringify({ type, data }))
  })
}
dc.onmessage = function (e) {
  console.log('message', e)
}
dc.onerror = function (e) {
  console.log('error', e)
}
pc.onicecandidate = function (e) {
  console.log('conditate', JSON.stringify(e.candidate))
  if (e.candidate) {
    ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate))
  }
}
ipcRenderer.on('candidate', (e, candidate) => {
  addIceCandidate(candidate)
})
let candidates = []
async function addIceCandidate(candidate) {
  if (candidate) {
    candidates.push(JSON.parse(candidate))
  }
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
    candidates = []
  }
}
// window.addIceCandidate = addIceCandidate
async function createOffer() {
  const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true,
  })
  await pc.setLocalDescription(offer)
  console.log('pc offer', JSON.stringify(pc.localDescription))
  return pc.localDescription
}

async function setRemote(answer) {
  await pc.setRemoteDescription(answer)
}
ipcRenderer.on('answer', (e, answer) => {
  console.log(e, answer);
  setRemote(answer)
})
// window.setRemote = setRemote
pc.onaddstream = function (e) {
  console.log('addstream', e)
  peer.emit('add-stream', e.stream)
}
export { peer, createOffer }
